import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { StudyPlan } from './entities/study-plan.entity';
import { ExamSchedule } from './entities/exam-schedule.entity';
import { StudySchedule } from '../studySchedule/entities/studySchedule.entity';
import { Subject } from '../subject/entities/subject.entity';
import { SubjectService } from '../subject/subject.service';
import { User } from '../users/entities/user.entity';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import { z } from 'zod';
import { zodTextFormat } from 'openai/helpers/zod';
import { ChatGptPrompt } from './entities/chatGptPrompt.entity';
import Handlebars from 'handlebars';
import {
  ICreateStudyPlanService,
  IStudyPlanServiceFindChatGptPrompt,
  IStudyPlanServiceFindSchedules,
  IStudyPlanServiceFindStudyPlan,
  IStudyPlanServiceFindStudyPlans,
  IStudyPlanServiceParseStudySchedule,
  IStudyPlanServiceUpdateSchedule,
} from './interfaces/study-plan.interface';
import { StudyScheduleService } from '../studySchedule/studyschedule.service';
import { StudyStatusService } from '../study-status/study-status.service'; // ✅ 추가됨

dotenv.config();

const studyPlanRespose = z.object({
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  subject: z.string().min(1),
  content: z.string().min(1),
});
const StudyPlanResponseSchema = z.object({
  newSchedules: z.array(studyPlanRespose),
});
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

@Injectable()
export class StudyPlansService {
  constructor(
    @InjectRepository(StudyPlan)
    private readonly studyPlanRepository: Repository<StudyPlan>,
    @InjectRepository(ExamSchedule)
    private readonly examScheduleRepository: Repository<ExamSchedule>,
    @InjectRepository(StudySchedule)
    private readonly studyScheduleRepository: Repository<StudySchedule>,
    private readonly studyScheduleService: StudyScheduleService,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    private readonly subjectService: SubjectService,
    @InjectRepository(ChatGptPrompt)
    private readonly chatGptPrompt: Repository<ChatGptPrompt>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly studyStatusService: StudyStatusService, // ✅ StudyStatusService 주입
  ) {}

  async createStudyPlan({ userId, createStudyPlanInput }: ICreateStudyPlanService): Promise<StudyPlan> {
    const promptName = '계획생성';
    try {
      const {
        title,
        availableStudyScheduleInput,
        studyPeriod,
        learningStyle,
        reviewDays,
        missedPlanDays,
        subjects,
      } = createStudyPlanInput;

      const availableTimes = availableStudyScheduleInput
        .map(
          (schedule) =>
            `${schedule.day}: ${schedule.timeRanges
              .map((time) => `${time.startTime} - ${time.endTime}`)
              .join(', ')}`,
        )
        .join('\n');

      const reviewDay = reviewDays.join(',');
      const missedPlanDay = missedPlanDays.join(',');
      const subjectsPrompt = subjects.map(this.formatSubject).join('\n\n');

      console.log('title:', title);
      const promptData = {
        studyPeriod,
        availableTimes,
        learningStyle,
        reviewDay,
        missedPlanDay,
        subjectsPrompt,
      };

      const findPrompt = await this.findChatGptPrompt({ promptName });
      const compilePrompt = Handlebars.compile(findPrompt);
      const prompt = compilePrompt(promptData);
      console.log(prompt);

      const response = await openai.responses.parse({
        model: 'gpt-4o',
        input: [
          {
            role: 'system',
            content:
              '당신은 사용자의 학습 정보를 바탕으로 하루 단위의 학습 계획을 JSON 형식으로 작성하는 AI입니다.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        text: {
          format: zodTextFormat(StudyPlanResponseSchema, 'studyPlanText'),
        },
      });

      const { newSchedules } = response.output_parsed;
      console.log('OpenAI 응답 원문:', newSchedules);

      const user = await this.usersRepository.findOneBy({ id: userId });

      const studyPlan = this.studyPlanRepository.create({
        title,
        studyPeriod,
        user,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const saveStudyPlan = await this.studyPlanRepository.save(studyPlan);
      const savedSchedules = await this.parseStudySchedule({ newSchedules, studyPlan, userId });
      const savedExamSchedules = await this.saveExamSchedules({ subjects, studyPlan });

      saveStudyPlan.schedules = savedSchedules;
      saveStudyPlan.examSchedules = savedExamSchedules;

      // ✅ 계획 생성 후 학습 현황 자동 계산 및 저장
      await this.studyStatusService.recomputeStatusesForPlan(saveStudyPlan.id, userId);
      console.log('✅ StudyStatus 자동 계산 완료');

      return saveStudyPlan;
    } catch (error) {
      console.error('학습 계획 생성 중 오류 발생:', error);
      throw new Error('학습 계획 생성에 실패했습니다.');
    }
  }

  async parseStudySchedule(scheduleData: IStudyPlanServiceParseStudySchedule) {
    const { newSchedules, userId, studyPlan } = scheduleData;

    const subjectTitles = [...new Set(newSchedules.map((s) => s.subject))] as string[];
    const subjectName = await this.subjectService.find({ subjectTitles });
    const subjectEntities = new Map(subjectName.map((s) => [s.subjectName, s]));

    const scheduleEntities = newSchedules.map((s) => ({
      startTime: new Date(s.startTime),
      endTime: new Date(s.endTime),
      content: s.content,
      user: { id: userId },
      studyPlan: studyPlan,
      subject: subjectEntities.get(s.subject),
    }));

    const savedSchedules = await this.studyScheduleRepository.save(scheduleEntities);
    return savedSchedules;
  }

  async saveExamSchedules({ subjects, studyPlan }: { subjects: any[]; studyPlan: StudyPlan }): Promise<ExamSchedule[]> {
    const examSchedules = [];

    for (const subject of subjects) {
      for (const examContent of subject.examContentInput) {
        const examSchedule = this.examScheduleRepository.create({
          examContent: examContent.examcontent,
          examStartDay: examContent.examStartDay,
          examLastScore: examContent.examLastScore,
          examGoalScore: examContent.examGoalScore,
          studyPlan: studyPlan,
        });
        examSchedules.push(examSchedule);
      }
    }

    return await this.examScheduleRepository.save(examSchedules);
  }

  async updateExamSchedules({
    examUpdateContentInput,
    studyPlan,
  }: {
    examUpdateContentInput: any[];
    studyPlan: StudyPlan;
  }): Promise<ExamSchedule[]> {
    await this.examScheduleRepository.delete({ studyPlan: { id: studyPlan.id } });

    const examSchedules = examUpdateContentInput.map((exam) =>
      this.examScheduleRepository.create({
        examContent: exam.examcontent,
        examStartDay: exam.examStartDay,
        examLastScore: exam.examLastScore,
        examGoalScore: exam.examGoalScore,
        studyPlan: studyPlan,
      }),
    );

    return await this.examScheduleRepository.save(examSchedules);
  }

  async updateStudyPlan(updateScheduleInput: IStudyPlanServiceUpdateSchedule) {
    const promptName = '계획조정';
    try {
      const { userId, updateStudyPlanInput } = updateScheduleInput;
      const { availableStudyScheduleInput, examUpdateContentInput, studyPlanId } = updateStudyPlanInput;
      const availableTimes = availableStudyScheduleInput
        .map((d) => `${d.day}: ${d.timeRanges.map((t) => `${t.startTime} - ${t.endTime}`).join(', ')}`)
        .join('\n');

      const examContent = examUpdateContentInput
        .map(
          (exam) =>
            `과목:${exam.subjectName}: 시험범위:${exam.examcontent}, 시험일정:${exam.examStartDay}`,
        )
        .join('\n');
      const fullschedule = await this.findOne({ studyPlanId, userId });
      const { schedules, studyPeriod } = fullschedule;
      const studyPlan = fullschedule;

      const trimSchedules = schedules
        .map((s) => {
          const startIso = new Date(s.startTime).toISOString();
          const endIso = new Date(s.endTime).toISOString();
          return `과목:${s.subject.subjectName}, 시간:${startIso}-${endIso}, 계획내용:${s.content}`;
        })
        .join('\n');

      const promptData = {
        availableTimes,
        examContent,
        studyPeriod,
        trimSchedules,
      };
      const findPrompt = await this.findChatGptPrompt({ promptName });
      const compilePrompt = Handlebars.compile(findPrompt);
      const prompt = compilePrompt(promptData);
      console.log('프롬프트:', prompt);

      const response = await openai.responses.parse({
        model: 'gpt-4o',
        input: [
          {
            role: 'system',
            content:
              '당신은 사용자의 기존 학습 계획과 변동사항에 맞춰 학습 계획을 조정해주는 학습플레너입니다.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        text: {
          format: zodTextFormat(StudyPlanResponseSchema, 'studyPlanText'),
        },
      });

      const { newSchedules } = response.output_parsed;
      console.log('OpenAI 응답 원문:', newSchedules);

      await this.studyScheduleRepository.delete({ studyPlan: { id: studyPlan.id } });

      const saveStudyPlan = await this.studyPlanRepository.save(studyPlan);
      const savedSchedules = await this.parseStudySchedule({ newSchedules, studyPlan, userId });
      await this.updateExamSchedules({ examUpdateContentInput, studyPlan });

      saveStudyPlan.schedules = savedSchedules;

      // ✅ 수정 시에도 상태 갱신 (선택)
      await this.studyStatusService.recomputeStatusesForPlan(studyPlan.id, userId);
      console.log('✅ 계획 수정 후 StudyStatus 재계산 완료');

      return saveStudyPlan;
    } catch (error) {
      console.error('학습 계획 조정 중 오류 발생:', error);
      throw new Error('학습 계획 조정에 실패했습니다.');
    }
  }

  async findChatGptPrompt({ promptName }: IStudyPlanServiceFindChatGptPrompt): Promise<string> {
    const chatGptPrompt = await this.chatGptPrompt.findOne({ where: { promptName } });
    if (!chatGptPrompt || !chatGptPrompt.promptText) throw new Error('없는 프롬프트입니다.');
    return chatGptPrompt.promptText;
  }

  formatSubject(subjects) {
    const books = subjects.studyBookInput
      .map(
        (book) =>
          `교재명:${book.bookName}, 목차:${book.bookIndex}, 목표회독수:${book.bookReview}`,
      )
      .join('\n');
    const exams = subjects.examContentInput
      .map(
        (exam) =>
          `시험범위:${exam.examcontent}, 직전시험성적:${exam.examLastScore}, 목표점수:${exam.examGoalScore}, 시험일정:${exam.examStartDay}`,
      )
      .join('\n');
    return `
      과목: ${subjects.subject}
      학업수준: ${subjects.studyLevel}
      교재:
      ${books}
      시험정보:
      ${exams}
      `.trim();
  }

  async findAll({ user }: IStudyPlanServiceFindStudyPlans): Promise<StudyPlan[]> {
    return await this.studyPlanRepository.find({ where: { user: { id: user.id } } });
  }

  async findOne({ studyPlanId, userId }: IStudyPlanServiceFindStudyPlan): Promise<StudyPlan> {
    const studyPlan = await this.studyPlanRepository.findOne({
      where: { user: { id: userId }, id: studyPlanId },
      relations: ['schedules', 'schedules.subject', 'examSchedules'],
    });
    if (!studyPlan) {
      throw new ConflictException('해당 학습 계획이 없습니다.');
    }
    return studyPlan;
  }

  async findExamSchedules({
    studyPlanId,
    userId,
  }: {
    studyPlanId: number;
    userId: number;
  }): Promise<ExamSchedule[]> {
    const studyPlan = await this.studyPlanRepository.findOne({
      where: { user: { id: userId }, id: studyPlanId },
    });

    if (!studyPlan) {
      throw new ConflictException('해당 학습 계획이 없습니다.');
    }

    return await this.examScheduleRepository.find({
      where: { studyPlan: { id: studyPlanId } },
      relations: ['studyPlan'],
    });
  }
}

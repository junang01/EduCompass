import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { StudyPlan } from './entities/study-plan.entity';
import { StudySchedule } from '../studyschedule/entities/studyschedule.entity';
import { Subject } from '../subject/entities/subject.entity';
import { SubjectService } from '../subject/subject.service';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import {z} from'zod';
import { zodTextFormat } from "openai/helpers/zod";
import { ChatGptPrompt } from './entities/chatGptPrompt.entity';  
import Handlebars from 'handlebars';
import { ICreateStudyPlanService, IStudyPlanServiceFindChatGptPrompt, IStudyPlanServiceFindStudyPlan, IStudyPlanServiceFindStudyPlans } from './interfaces/study-plan.interface';


dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

@Injectable()
export class StudyPlansService {
  constructor(
    @InjectRepository(StudyPlan)
    private readonly studyPlanRepository: Repository<StudyPlan>,
    @InjectRepository(StudySchedule)
    private readonly studyScheduleRepository: Repository<StudySchedule>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    private readonly subjectService: SubjectService,
    @InjectRepository(ChatGptPrompt)
    private readonly chatGptPrompt: Repository<ChatGptPrompt>,
  ) {}

  async createStudyPlan({ userId, createStudyPlanInput }: ICreateStudyPlanService): Promise<StudyPlan> {
    const promptName = '계획생성';
    try {
      const { title, availableStudyScheduleInput, studyPeriod, learningStyle, reviewDays, missedPlanDays, subjects } = createStudyPlanInput;
      const availableTimes = availableStudyScheduleInput
        .map((schedule) => `${schedule.day}: ${schedule.timeRanges.map((time) => `${time.startTime} - ${time.endTime}`).join(', ')}`)
        .join('\n'); // 학습 가능 시간으로 요일: 시작시간 - 종료시간 배열로 파싱
      const reviewDay = reviewDays.join(',');
      const missedPlanDay = missedPlanDays.join(',');
      const subjectsPrompt = subjects.map(this.formatSubject).join('\n\n');

      console.log('title:', title); //title확인 왜이러니 너는 좀
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

      const studyPlanRespose = z.object({
        startTime: z.string().datetime(),
        endTime: z.string().datetime(),
        subject: z.string().min(1),
        content: z.string().min(1),
      })
      const StudyPlanResponseSchema = z.object({
        schedules: z.array(studyPlanRespose),
      });
      const response = await openai.responses.parse({
        model:"gpt-4o",
        input:[
          {role:"system", content: "당신은 사용자의 학습 정보를 바탕으로 하루 단위의 학습 계획을 JSON 형식으로 작성하는 AI입니다."},
          {
            role:"user",
            content:prompt
          },
        ],
        text: {
          format: zodTextFormat(StudyPlanResponseSchema, "studyPlanText")
        },
      })
      // const response = await openai.chat.completions.create({
      //   model: 'gpt-4o',
        
      //   messages: [
      //     {
      //       role: 'system',
      //       content: '당신은 사용자의 학습 정보를 바탕으로 하루 단위의 학습 계획을 JSON 형식으로 작성하는 AI입니다. 다음 구조에서 절대 벗어나지 마라: 응답은 반드시 JSON 배열 형식으로만 작성하세요. 각 객체는 다음 필드를 포함해야 합니다: - startTime: ISO 8601 UTC 형식의 문자열 (예: "2025-05-30T05:00:00.000Z"), null 값 불가 - endTime: ISO 8601 UTC 형식의 문자열 (예: "2025-05-30T07:00:00.000Z"), null 값 불가 - subject: 문자열, null 값 불가 - content: 문자열, null 값 불가'
      //     },
      //     {
      //       role: 'user',
      //       content: prompt,
      //     },
      //   ],
      // });

      const schedules= response.output_parsed;
      console.log('OpenAI 응답 원문:', schedules);

      const scheduleData = schedules.schedules;
      const studyPlan = this.studyPlanRepository.create({
        title,
        studyPeriod,
        user: { id: userId },
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const saveStudyPlan = await this.studyPlanRepository.save(studyPlan);

      // 1. GPT 응답에 들어있는 과목명 다 뽑기
      const subjectTitles = [...new Set(scheduleData.map((s) => s.subject))] as string[];


      // 2. DB에서 해당 과목들 찾기
      const subjectName = await this.subjectService.find({ subjectTitles });
      // 3. 이름 → 엔티티 매핑 만들기
      const subjectEntities = new Map(subjectName.map((s) => [s.subjectName, s]));
      // 4. subjectEntity로 연결시켜버리기!~
      const scheduleEntities = scheduleData.map((s) => ({
        startTime: new Date(s.startTime),
        endTime: new Date(s.endTime),
        content: s.content,
        user: { id: userId },
        studyPlan: studyPlan,
        subject:subjectEntities.get(s.subject), // 여기가 핵심!
      }));

      const savedSchedules = await this.studyScheduleRepository.save(scheduleEntities);
      saveStudyPlan.schedules = savedSchedules;
      return saveStudyPlan
    } catch (error) {
      console.error('학습 계획 생성 중 오류 발생:', error);
      throw new Error('학습 계획 생성에 실패했습니다.');
    }
  }

  async findChatGptPrompt({ promptName }: IStudyPlanServiceFindChatGptPrompt): Promise<string> {
    const chatGptPrompt = await this.chatGptPrompt.findOne({ where: { promptName} });
    if ( !chatGptPrompt || !chatGptPrompt.promptText) throw new Error('없는 프롬프트입니다.');
    console.log(chatGptPrompt.promptText);
    return chatGptPrompt.promptText;
  }

  formatSubject(subjects) {
    const books = subjects.studyBookInput.map((book) => `교재명:${book.bookName}, 목차:${book.bookIndex}, 목표회독수:${book.bookReview}`).join('\n');
    const exams = subjects.examContentInput
      .map(
        (exam) =>
          `시험범위:${exam.examcontent}, 직전시험성적:${exam.examLastScore}, 목표점수:${exam.examGoalScore}, 시험일정:${exam.examStartDay}
      `,
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

  async findAll({user}:IStudyPlanServiceFindStudyPlans):Promise<StudyPlan[]>{
    return await this.studyPlanRepository.find(
      {where:{user:{id:user.id}, }})}


  async findOne({studyPlanId, user}: IStudyPlanServiceFindStudyPlan):Promise<StudyPlan>{
    return await this.studyPlanRepository.findOne(
      {where:
        {user:{id:user.id},id:studyPlanId},
        relations:['schedules', 'schedules.subject']
      })
  }
}

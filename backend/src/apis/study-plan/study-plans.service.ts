import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudyPlan } from './entities/study-plan.entity';
import { StudySchedule } from '../studyschedule/entities/studyschedule.entity';
import { Subject } from '../subject/entities/subject.entity';
import { SubjectService } from '../subject/subject.service';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import { ICreateStudyPlanService } from './interface/study-plan.interface';
import { title } from 'process';

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
  ) {}

  async createStudyPlan({ userId, createStudyPlanInput }: ICreateStudyPlanService): Promise<StudyPlan> {
    try {
      const availableTimes = createStudyPlanInput.availableStudyScheduleInput
        .map((schedule) => `${schedule.day}: ${schedule.timeRanges.map((time) => `${time.startTime}-${time.endTime}`).join(', ')}`)
        .join('; ');

      const examGoals = createStudyPlanInput.examContentInput.map((exam) => exam.examcontent).join(', ');

      const books = createStudyPlanInput.studyBookInput
        .map((book) => `교재명: ${book.bookName}, 과목명: ${book.subject}, 목차: ${book.bookIndex}, 회독 횟수: ${book.bookReview}`)
        .join('\n');

      const prompt = `
        당신은 전문 학습 플래너입니다.
        다음 정보를 기반으로 학습 계획을 세워주세요:
        - 학습 기간: ${createStudyPlanInput.studyPeriod}
        - 공부 가능 시간: ${availableTimes}
        - 목표 점수: ${examGoals}
        - 학업 수준: ${createStudyPlanInput.studyLevel}
        - 교재 정보:
        ${books}
        - 복습 요일: ${createStudyPlanInput.reviewDays.join(', ')}
        - 미시행 계획 수행일: ${createStudyPlanInput.missedPlanDay.join(', ')}
        다음 조건을 반드시 지켜야 합니다:
        1. 전체 학습 기간 동안 하루도 빠짐없이 날짜별 계획을 생성해야 합니다.
        2. 각 날짜는 아래 항목들을 포함하는 JSON 배열 형식으로만 작성하세요:
           - date (예: 2025-04-20)
           - day (예: 일요일)
           - startTime (예: 09:00)
           - endTime (예: 12:00)
           - subject (예: 수학)
           - content (예: 교재명 Chapter x 페이지 범위)
        3. 학습 계획의 현실성을 반드시 고려해야 합니다:
           - 과목별 학습 균형을 유지
        4. 교재의 요청한 반복 회독수만큼만 진행해야 합니다.
           - 사용자가 요청한 회독수만큼만 계획을 생성해주세요
        5. 요일별 학습 계획은 정렬된 순서로 작성하고, 날짜를 절대 생략하지 마세요.
        6. 휴식일 없이 매일 학습이 포함되어야 합니다.
         응답은 반드시 JSON 배열 형식만 사용하세요. 객체나 설명은 포함하지 마세요.
      `;

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: '당신은 사용자의 학습 정보를 바탕으로 하루 단위의 학습 계획을 JSON 형식으로 작성하는 AI입니다. 오직 JSON만 응답해주세요.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const studyPlanText = response.choices[0].message.content;
      let scheduleData;
      try {
        scheduleData = JSON.parse(studyPlanText);
      } catch (error) {
        console.error('JSON 파싱 오류:', error);
        throw new Error('OpenAI 응답 형식에 오류가 있습니다.');
      }

      // 응답 데이터가 비어있을 경우 처리
      if (!scheduleData || scheduleData.length === 0) {
        throw new Error('OpenAI 응답에 학습 계획 정보가 없습니다.');
      }

      // 학습 계획 기간 처리
      const [startDateStr, endDateStr] = createStudyPlanInput.studyPeriod.split(' to ');
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);

      // 과목 정보 준비
      const subjectNames = [...new Set(createStudyPlanInput.studyBookInput.map((book) => book.subject))];
      const subjectEntities: Subject[] = await Promise.all(subjectNames.map((name) => this.subjectService.findOrCreateByName(name)));

      const mainSubject = subjectEntities[0];

      // StudyPlan 객체 생성
      const studyPlan = this.studyPlanRepository.create({
        title: title,
        studyGoal: createStudyPlanInput.studyLevel,
        statePlan: true,
        userId: userId, // 실제 사용자 ID로 변경
        subject_seq: mainSubject.id,
        subject: mainSubject,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const savedStudyPlan = await this.studyPlanRepository.save(studyPlan);

      // StudySchedule 객체 저장
      const schedulePromises = scheduleData.map(async (scheduleItem) => {
        const schedule = this.studyScheduleRepository.create({
          day: `${scheduleItem.date} ${scheduleItem.day}`,
          startTime: scheduleItem.startTime,
          endTime: scheduleItem.endTime,
          subject: scheduleItem.subject,
          content: scheduleItem.content,
          date: scheduleItem.date,
          completed: false,
          studyPlan: savedStudyPlan, // StudyPlan과 연결
        });
        await this.studyScheduleRepository.save(schedule);
      });

      // 모든 스케줄 저장 후 완료
      await Promise.all(schedulePromises);

      // StudyPlan 반환 시 스케줄 포함
      savedStudyPlan.schedules = await this.studyScheduleRepository.find({
        where: { studyPlan: savedStudyPlan },
        relations: ['studyPlan'],
        order: {
          date: 'ASC',
          startTime: 'ASC', // 날짜 및 시간 기준으로 정렬
        },
      });

      return savedStudyPlan;
    } catch (error) {
      console.error('학습 계획 생성 중 오류 발생:', error);
      throw new Error('학습 계획 생성에 실패했습니다.');
    }
  }
}

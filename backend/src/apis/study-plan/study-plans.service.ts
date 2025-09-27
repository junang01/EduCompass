import { ConflictException, Injectable } from '@nestjs/common';
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
import { ICreateStudyPlanService, IStudyPlanServiceFindChatGptPrompt, IStudyPlanServiceFindSchedules, IStudyPlanServiceFindStudyPlan, IStudyPlanServiceFindStudyPlans, IStudyPlanServiceParseStudySchedule, IStudyPlanServiceUpdateSchedule } from './interfaces/study-plan.interface';
import { StudyScheduleService } from '../studySchedule/studyschedule.service';


dotenv.config();

const studyPlanRespose = z.object({
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  subject: z.string().min(1),
  content: z.string().min(1),
})
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
    @InjectRepository(StudySchedule)
    private readonly studyScheduleRepository: Repository<StudySchedule>,
    private readonly studyScheduleService: StudyScheduleService,
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
      
      // --- 변경 시작: availableTimes KST -> UTC 변환 로직 추가 ---
      const availableTimes = availableStudyScheduleInput
        .map((schedule) => {
          const utcTimeRanges = schedule.timeRanges.map((time) => {
            const [startHourStr, startMinuteStr] = time.startTime.split(':');
            const [endHourStr, endMinuteStr] = time.endTime.split(':');

            const startHour = parseInt(startHourStr);
            const startMinute = parseInt(startMinuteStr);
            const endHour = parseInt(endHourStr);
            const endMinute = parseInt(endMinuteStr);

            const KST_OFFSET_HOURS = 9; // 한국 표준시 (KST)는 UTC+9

            // KST 시간을 UTC 시간으로 변환하는 헬퍼 함수
            const getUtcHourMinute = (hour: number, minute: number): [number, number] => {
                let utcHour = hour - KST_OFFSET_HOURS;
                let utcMinute = minute;

                // 시간이 음수가 되면 이전 날짜로 넘어가는 것이므로 24시간을 더해줍니다.
                // (이 경우 요일은 이미 프론트에서 넘어왔으므로, 시간만 변경)
                if (utcHour < 0) {
                    utcHour += 24; 
                }
                return [utcHour, utcMinute];
            };

            const [utcStartHour, utcStartMinute] = getUtcHourMinute(startHour, startMinute);
            const [utcEndHour, utcEndMinute] = getUtcHourMinute(endHour, endMinute);

            const formattedUtcStartTime = `${String(utcStartHour).padStart(2, '0')}:${String(utcStartMinute).padStart(2, '0')}`;
            const formattedUtcEndTime = `${String(utcEndHour).padStart(2, '0')}:${String(utcEndMinute).padStart(2, '0')}`;

            return `${formattedUtcStartTime} - ${formattedUtcEndTime}`;
          }).join(', ');
          
          return `${schedule.day}: ${utcTimeRanges}`;
        })
        .join('\n');
      // --- 변경 끝 ---

      const reviewDay = reviewDays.join(',');
      const missedPlanDay = missedPlanDays.join(',');
      const subjectsPrompt = subjects.map(this.formatSubject).join('\n\n');
      const studyPeriodParts = studyPeriod.split(' ~ ');
      const studyPeriod_startDate = studyPeriodParts[0];
      const studyPeriod_startDay = this.getDayName(studyPeriod_startDate);
      console.log('title:', title);
      const promptData = {
        studyPeriod,
        studyPeriod_startDate,
        studyPeriod_startDay,
        availableTimes, // 이제 이 값은 UTC 기준으로 변환된 시간 정보를 포함합니다.
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

      const {newSchedules}= response.output_parsed;
      console.log('OpenAI 응답 원문:', newSchedules);
      
      const studyPlan = this.studyPlanRepository.create({
        title,
        studyPeriod,
        user: { id: userId },
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const saveStudyPlan = await this.studyPlanRepository.save(studyPlan);
      const savedSchedules = await this.parseStudySchedule({newSchedules, studyPlan, userId})

      saveStudyPlan.schedules = savedSchedules;
      return saveStudyPlan
    } catch (error) {
      console.error('학습 계획 생성 중 오류 발생:', error);
      throw new Error('학습 계획 생성에 실패했습니다.');
    }
  }

  async parseStudySchedule(scheduleData:IStudyPlanServiceParseStudySchedule){
    const {newSchedules, userId, studyPlan} = scheduleData
      const subjectTitles = [...new Set(newSchedules.map((s) => s.subject))] as string[];
      const subjectName = await this.subjectService.find({ subjectTitles });
      const subjectEntities = new Map(subjectName.map((s) => [s.subjectName, s]));
      const scheduleEntities = newSchedules.map((s) => ({
        startTime: new Date(s.startTime),
        endTime: new Date(s.endTime),
        content: s.content,
        user: { id: userId },
        studyPlan: studyPlan,
        subject:subjectEntities.get(s.subject),
      }));

      const savedSchedules = await this.studyScheduleRepository.save(scheduleEntities);
      return savedSchedules;
  }
  
  async updateStudyPlan(updateScheduleInput:IStudyPlanServiceUpdateSchedule){
    const promptName = "계획조정";
    try {
    const {userId, updateStudyPlanInput} = updateScheduleInput;
    const {availableStudyScheduleInput, examUpdateContentInput, studyPlanId, homeworkUpdateInput} = updateStudyPlanInput;
    
    // --- 변경 시작: updateStudyPlan의 availableTimes KST -> UTC 변환 로직 추가 ---
    const availableTimes = availableStudyScheduleInput.map(
      (schedule) => {
          const utcTimeRanges = schedule.timeRanges.map((time) => {
            const [startHourStr, startMinuteStr] = time.startTime.split(':');
            const [endHourStr, endMinuteStr] = time.endTime.split(':');

            const startHour = parseInt(startHourStr);
            const startMinute = parseInt(startMinuteStr);
            const endHour = parseInt(endHourStr);
            const endMinute = parseInt(endMinuteStr);

            const KST_OFFSET_HOURS = 9; // 한국 표준시 (KST)는 UTC+9

            const getUtcHourMinute = (hour: number, minute: number): [number, number] => {
                let utcHour = hour - KST_OFFSET_HOURS;
                let utcMinute = minute;

                if (utcHour < 0) {
                    utcHour += 24; 
                }
                return [utcHour, utcMinute];
            };

            const [utcStartHour, utcStartMinute] = getUtcHourMinute(startHour, startMinute);
            const [utcEndHour, utcEndMinute] = getUtcHourMinute(endHour, endMinute);

            const formattedUtcStartTime = `${String(utcStartHour).padStart(2, '0')}:${String(utcStartMinute).padStart(2, '0')}`;
            const formattedUtcEndTime = `${String(utcEndHour).padStart(2, '0')}:${String(utcEndMinute).padStart(2, '0')}`;

            return `${formattedUtcStartTime} - ${formattedUtcEndTime}`;
          }).join(', ');
          
          return `${schedule.day}: ${utcTimeRanges}`;
        }
    ).join('\n');
    // --- 변경 끝 ---
   
    const examContent =  examUpdateContentInput.map((exam) => `과목:${exam.subjectName}: 시험범위:${exam.examcontent}, 시험일정:${exam.examStartDay}`).join('\n');

    const homework = homeworkUpdateInput.map((homework) => 
      `과제이름:${homework.homeworkName}, 과제내용:${homework.homeworkContent}, 과제시작일:${homework.homeworkStartDay}, 과제마감일:${homework.homeworkEndDay}`
    ).join('\n ');
    const fullschedule = await this.findOne({ studyPlanId, userId });
    const{schedules, studyPeriod} = fullschedule
    const studyPlan = fullschedule
    
    const trimSchedules = schedules.map((s) => {
      const startIso = new Date(s.startTime).toISOString();
      const endIso = new Date(s.endTime).toISOString();
      return `과목:${s.subject.subjectName}, 시간:${startIso}-${endIso}, 계획내용:${s.content}`;
    }).join('\n');

    const promptData = {
      availableTimes, // 이제 이 값은 UTC 기준으로 변환된 시간 정보를 포함합니다.
      examContent,
      homework,
      studyPeriod,
      trimSchedules
    };
    const findPrompt = await this.findChatGptPrompt({ promptName });
    const compilePrompt = Handlebars.compile(findPrompt);
    const prompt = compilePrompt(promptData);
    console.log("프롬프트:",prompt);
    const response = await openai.responses.parse({
      model:"gpt-4o",
      input:[
        {role:"system", content: "당신은 사용자의 기존 학습 계획과 변동사항에 맞춰 학습 계획을 조정해주는 학습플레너입니다."},
        {
          role:"user",
          content:prompt
        },
      ],
      text: {
        format: zodTextFormat(StudyPlanResponseSchema, "studyPlanText")
      },
    })

    const {newSchedules}= response.output_parsed;
    console.log('OpenAI 응답 원문:', newSchedules);
    

    const saveStudyPlan = await this.studyPlanRepository.save(studyPlan);
    const savedSchedules = await this.parseStudySchedule({newSchedules, studyPlan, userId})

    saveStudyPlan.schedules = savedSchedules;
    return saveStudyPlan
    }catch(error){
      console.error('학습 계획 조정 중 오류 발생:', error);
      throw new Error('학습 계획 조정에 실패했습니다.');
    }
  }

  async findChatGptPrompt({ promptName }: IStudyPlanServiceFindChatGptPrompt): Promise<string> {
    const chatGptPrompt = await this.chatGptPrompt.findOne({ where: { promptName} });
    if ( !chatGptPrompt || !chatGptPrompt.promptText) throw new Error('없는 프롬프트입니다.');
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
    const studyPlans =  await this.studyPlanRepository.find(
      {where:{user:{id:user.id}, }})
      if(!studyPlans){
        throw new ConflictException("생성한 계획이 없습니다.")
      }
      return studyPlans
    }


  async findOne({studyPlanId, userId}: IStudyPlanServiceFindStudyPlan):Promise<StudyPlan>{
    const studyPlan = await this.studyPlanRepository.findOne(
      {where:
        {user:{id:userId},id:studyPlanId},
        relations:['schedules', 'schedules.subject']
      })
      if(!studyPlan){
        throw new ConflictException("해당 학습 계획이 없습니다.")
      }
      return studyPlan
  }
  getDayName(dateString: string): string { // string 반환 타입으로 명시
    const date = new Date(dateString);
    const dayNames = ['일요일','월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    return dayNames[date.getDay()];
  }
  async seedDummySchedules(studyPlanId: number, userId: number): Promise<StudyPlan> {
    const studySchedules = [
      {
        startTime: '2025-06-18T05:00:00.000Z',
        endTime: '2025-06-18T07:00:00.000Z',
        subject: '화법과 작문',
        content: '화법의 기초와 소통의 원리 (p.01 - p.10)'
      },
      {
        startTime: '2025-06-19T02:00:00.000Z',
        endTime: '2025-06-19T04:00:00.000Z',
        subject: '화법과 작문',
        content: '상황에 따른 말하기 전략 (p.11 - p.20)'
      },
      {
        startTime: '2025-06-20T07:00:00.000Z',
        endTime: '2025-06-20T09:00:00.000Z',
        subject: '화법과 작문',
        content: '청자의 유형과 반응 고려하기 (p.21 - p.30)'
      },
      {
        startTime: '2025-06-21T00:00:00.000Z',
        endTime: '2025-06-21T02:00:00.000Z',
        subject: '화법과 작문',
        content: '비언어적 표현과 청각 요소 (p.31 - p.40)'
      },
      {
        startTime: '2025-06-23T03:00:00.000Z',
        endTime: '2025-06-23T05:00:00.000Z',
        subject: '화법과 작문',
        content: '듣기의 과정과 유형 (p.41 - p.50)'
      },
      {
        startTime: '2025-06-23T05:30:00.000Z',
        endTime: '2025-06-23T07:30:00.000Z',
        subject: '화법과 작문',
        content: '컴퓨터구조 과제 – 자료 읽기 및 초안 작성'
      },
      {
        startTime: '2025-06-24T05:00:00.000Z',
        endTime: '2025-06-24T07:00:00.000Z',
        subject: '화법과 작문',
        content: '화법의 실제 적용: 발표 연습 (p.51 - p.60)'
      },
      {
        startTime: '2025-06-24T07:00:00.000Z',
        endTime: '2025-06-24T08:00:00.000Z',
        subject: '화법과 작문',
        content: '컴퓨터구조 과제 – 보고서 마무리 및 제출'
      },
      {
        startTime: '2025-06-25T05:00:00.000Z',
        endTime: '2025-06-25T07:00:00.000Z',
        subject: '화법과 작문',
        content: '작문의 기본 원리와 과정 (p.61 - p.70)'
      },
      {
        startTime: '2025-06-26T02:00:00.000Z',
        endTime: '2025-06-26T04:00:00.000Z',
        subject: '화법과 작문',
        content: '문단 구성과 글의 구조화 (p.71 - p.80)'
      },
      {
        startTime: '2025-06-27T07:00:00.000Z',
        endTime: '2025-06-27T09:00:00.000Z',
        subject: '화법과 작문',
        content: '개요 작성과 초안 구성법 (p.81 - p.90)'
      },
      {
        startTime: '2025-06-28T00:00:00.000Z',
        endTime: '2025-06-28T02:00:00.000Z',
        subject: '화법과 작문',
        content: '문장 표현과 문법적 적절성 (p.91 - p.100)'
      },
      {
        startTime: '2025-06-30T03:00:00.000Z',
        endTime: '2025-06-30T05:00:00.000Z',
        subject: '화법과 작문',
        content: '전체 복습 및 시험 대비 정리'
      },
      {
        startTime: '2025-07-01T08:00:00.000Z',
        endTime: '2025-07-01T10:00:00.000Z',
        subject: '화법과 작문',
        content: '화법과 작문 시험!'
      }
    ];
  
    const studyPlan = await this.studyPlanRepository.findOne({
      where: { id: studyPlanId, user: { id: userId } },
      relations: ['schedules', 'schedules.subject', 'user'],
    });
    
    if (!studyPlan) throw new ConflictException('해당 학습 계획이 없습니다.');
    
    if (!studyPlan.schedules || studyPlan.schedules.length === 0) {
      throw new ConflictException('학습 계획에 과목 정보가 없습니다.');
    }
    
    const subject = studyPlan.schedules[0].subject; // '화법과 작문' 과목 재활용
    
    // 기존 스케줄 삭제
    if (studyPlan.schedules.length > 0) {
      const scheduleIds = studyPlan.schedules.map((s) => s.id);
      await this.studyScheduleRepository.delete(scheduleIds);
    }
    
    const newSchedules = studySchedules.map((s) =>
      this.studyScheduleRepository.create({
        startTime: new Date(s.startTime),
        endTime: new Date(s.endTime),
        content: s.content,
        subject,
        user: { id: userId },
        studyPlan,
      }),
    );
    
    const savedSchedules = await this.studyScheduleRepository.save(newSchedules);
    studyPlan.schedules = savedSchedules;
    
    return studyPlan;
  }
  
  // getStudyPlan():string{
  //   const plans = {
  //     name: "기말고사 대비",
  //     period: "2025-06-18 ~ 2025-07-02"
  //   }
  // }
}
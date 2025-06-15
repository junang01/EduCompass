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
      // 1. GPT 응답에 들어있는 과목명 다 뽑기
      const subjectTitles = [...new Set(newSchedules.map((s) => s.subject))] as string[];
      // 2. DB에서 해당 과목들 찾기
      const subjectName = await this.subjectService.find({ subjectTitles });
      // 3. 이름 → 엔티티 매핑 만들기
      const subjectEntities = new Map(subjectName.map((s) => [s.subjectName, s]));
      // 4. subjectEntity로 연결시켜버리기!~
      const scheduleEntities = newSchedules.map((s) => ({
        startTime: new Date(s.startTime),
        endTime: new Date(s.endTime),
        content: s.content,
        user: { id: userId },
        studyPlan: studyPlan,
        subject:subjectEntities.get(s.subject), // 여기가 핵심!
      }));

      const savedSchedules = await this.studyScheduleRepository.save(scheduleEntities);
      return savedSchedules;
  }
  // 파싱하는 부분 공통 로직으로 분리하기.
  async updateStudyPlan(updateScheduleInput:IStudyPlanServiceUpdateSchedule){
    // 1. api 호출 준비
    const promptName = "계획조정";
    try {
    const {userId, updateStudyPlanInput} = updateScheduleInput;
    const {availableStudyScheduleInput, examUpdateContentInput, studyPlanId, homeworkUpdateInput} = updateStudyPlanInput;
    const availableTimes = availableStudyScheduleInput.map(
      (d) => `${d.day}: ${d.timeRanges.map((t) => `${t.startTime} - ${t.endTime}`).join(', ')}`
    ).join('\n');    
   
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

    // 2. JSON 타입 리턴 구조 만들기
    const promptData = {
      availableTimes,
      examContent,
      homework,
      studyPeriod,
      trimSchedules
    };
    const findPrompt = await this.findChatGptPrompt({ promptName });
    const compilePrompt = Handlebars.compile(findPrompt);
    const prompt = compilePrompt(promptData);
    console.log("프롬프트:",prompt);
    // 3. 사용자 입력 데이터 + 선택된 계획 넘겨줘 조정 요청
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
    

    // 5. 응답 받아 파싱해 저장
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
}

import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
@Entity()
export class ChatGptPrompt {
  //
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column()
  promptName: string;

  @Field(() => String)
  @Column({type:'text'})
  promptText: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}

// const aiCreateMainPrompt = `
// 당신은 전문 학습 플래너입니다.
// 다음 정보를 기반으로 학습 계획을 세워주세요:
// - 학습 기간: {{studyPeriod}}
// - 공부 가능 시간: {{availableTimes}}
// - 학습 스타일:{{learningStyle}}
// - 복습 요일: {{reviewDay}}
// - 미시행 계획 수행일: {{missedPlanDay}}
// - 과목별 정보:
//  {{subjectsPrompt}}
// 다음 조건을 반드시 지켜야 합니다:
// 1. 전체 학습 기간 동안 하루도 빠짐없이 날짜별 계획을 생성해야 합니다.
// 2. subject에는 사용자가 입력한 과목만 작성되어야 합니다.
// 3. 각 날짜는 아래 항목들을 포함하는 JSON 배열 형식으로만 작성하세요:
//    - date (예: 2025-04-20)
//    - startTime (예: 09:00)
//    - endTime (예: 12:00)
//    - subject (예: 수학)
//    - content (예: 교재명 Chapter x 페이지 범위)
// 4. 학습 계획의 현실성을 반드시 고려해야 합니다:
//    - 과목별 학습 균형을 유지
// 5. 교재의 요청한 반복 회독수만큼만 진행해야 합니다.
//    - 사용자가 요청한 회독수만큼만 계획을 생성해주세요
// 6. 휴식일 없이 매일 학습이 포함되어야 합니다.
// 응답은 반드시 JSON 배열 형식만 사용하세요. 객체나 설명은 포함하지 마세요.
// `;

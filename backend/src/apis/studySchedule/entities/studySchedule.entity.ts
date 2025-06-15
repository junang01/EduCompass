// src/apis/studyschedule/entities/studyschedule.entity.ts

import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { StudyPlan } from 'src/apis/study-plan/entities/study-plan.entity';
import { Subject } from 'src/apis/subject/entities/subject.entity';
import { User } from 'src/apis/users/entities/user.entity';

@ObjectType()
@Entity()
export class StudySchedule {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Date)
  @Column({ type: 'timestamp' })
  startTime: Date;

  @Field(() => Date)
  @Column({ type: 'timestamp' })
  endTime: Date;

  @Field(() => String)
  @Column()
  content: string;

  @Field()
  @Column({ default: false })
  completed: boolean;
  
  @Field()
  @Column({default:false})
  delay: boolean;

  // --- 아래 세 부분이 중요합니다: 외래 키 컬럼 명시적 선언 및 연결 ---

  // subjectId 컬럼: StudyStatusService에서 schedule.subjectId로 참조합니다.
  @Column({ nullable: true }) 
  subjectId: number; 

  @Field(() => Subject, {nullable:true})
  @ManyToOne(() => Subject, { nullable: true })
  @JoinColumn({ name: 'subjectId' }) // 위에서 선언한 subjectId 컬럼과 연결
  subject: Subject;


  // userId 컬럼: StudyStatusService에서 schedule.userId로 참조합니다.
  @Column() 
  userId: number; 

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.studySchedule, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' }) // 위에서 선언한 userId 컬럼과 연결
  user: User;


  // studyPlanId 컬럼: StudyStatusService에서 schedule.studyPlanId로 참조합니다.
  @Column({ nullable: true }) 
  studyPlanId: number; 

  @Field(() => StudyPlan, { nullable: true })
  @ManyToOne(() => StudyPlan, (studyPlan) => studyPlan.schedules, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'studyPlanId' }) // 위에서 선언한 studyPlanId 컬럼과 연결
  studyPlan: StudyPlan;
}
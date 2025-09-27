import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { StudyPlan } from './study-plan.entity';

@ObjectType()
@Entity()
export class ExamSchedule {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({ name: 'exam_content' })
  examContent: string;

  @Field(() => String)
  @Column({ name: 'exam_start_day' })
  examStartDay: string;

  @Field(() => String)
  @Column({ name: 'exam_last_score' })
  examLastScore: string;

  @Field(() => String)
  @Column({ name: 'exam_goal_score' })
  examGoalScore: string;

  @JoinColumn({ name: 'study_plan_id' })
  @Field(() => StudyPlan)
  @ManyToOne(() => StudyPlan, (studyPlan) => studyPlan.examSchedules, {
    onDelete: 'CASCADE',
  })
  studyPlan: StudyPlan;
}

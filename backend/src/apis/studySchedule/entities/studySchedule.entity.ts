import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { StudyPlan } from 'src/apis/study-plan/entities/study-plan.entity';

@ObjectType()
@Entity()
export class StudySchedule {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  day: string;

  @Field()
  @Column()
  startTime: string;

  @Field()
  @Column()
  endTime: string;

  @Field()
  @Column()
  subject: string;

  @Field()
  @Column()
  content: string;

  @Field()
  @Column()
  date: string;

  @Field()
  @Column({ default: false })
  completed: boolean;

  @Field(() => StudyPlan)
  @ManyToOne(() => StudyPlan, (studyPlan) => studyPlan.schedules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'study_plan_id' })
  studyPlan: StudyPlan;
}

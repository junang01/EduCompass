// src/apis/study-status/entities/study-status.entity.ts
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { StudyPlan } from '../../study-plan/entities/study-plan.entity';
import { Subject } from '../../subject/entities/subject.entity';

@ObjectType()
@Entity()
@Unique('UQ_user_plan_subject', ['user', 'studyPlan', 'subject'])
export class StudyStatus {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Float)
  @Column({ type: 'float', default: 0 })
  completionRate: number;

  // 엔티티 네이밍이 delayRate였으므로 그대로 두고, 서비스에서 매핑
  @Field(() => Float)
  @Column({ type: 'float', default: 0 })
  delayRate: number;

  @Field(() => Float)
  @Column({ type: 'float', default: 0 })
  remainingPercent: number;

  @JoinColumn({ name: 'subjectId' })
  @ManyToOne(() => Subject, { eager: false, nullable: false })
  @Field(() => Subject)
  subject: Subject;

  @JoinColumn({ name: 'studyPlanId' })
  @ManyToOne(() => StudyPlan, { eager: false, nullable: false })
  @Field(() => StudyPlan)
  studyPlan: StudyPlan;

  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => User, { eager: false, nullable: false })
  @Field(() => User)
  user: User;

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Field()
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}

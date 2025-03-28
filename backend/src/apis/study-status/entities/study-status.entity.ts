import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { StudyPlan } from '../../study-plan/entities/study-plan.entity';
import { Subject } from '../../subject/entities/subject.entity';

@ObjectType()
@Entity()
export class StudyStatus {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Float)
  @Column({ type: 'float', default: 0 })
  completionRate: number;

  @Field(() => Float)
  @Column({ type: 'float', default: 0 })
  postponeRate: number;

  @Field(() => Float)
  @Column({ type: 'float', default: 0 })
  incompleteRate: number;

  @Field(() => ID)
  @Column()
  subject_seq: number;

  @Field(() => Subject)
  @ManyToOne(() => Subject, subject => subject.studyStatuses)
  @JoinColumn({ name: 'subject_seq' })
  subject: Subject;

  @Field(() => ID)
  @Column()
  studyPlanId: number;

  @Field(() => StudyPlan)
  @ManyToOne(() => StudyPlan)
  @JoinColumn({ name: 'studyPlanId' })
  studyPlan: StudyPlan;

  @Field(() => ID)
  @Column()
  userId: number;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}

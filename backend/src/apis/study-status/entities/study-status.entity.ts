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
  delayRate: number;

  @Field(() => Float)
  @Column({ type: 'float', default: 0 })
  remainingPercent: number;

  @JoinColumn({ name: 'subject_seq' })
  @Field(() => Subject)
  @ManyToOne(() => Subject)
  subject: Subject;

  @JoinColumn({ name: 'subjectId' })
  @ManyToOne(() => StudyPlan)
  @Field(() => StudyPlan)
  studyPlan: StudyPlan;

  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => User)
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

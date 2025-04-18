import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Subject } from '../../subject/entities/subject.entity';

@ObjectType()
@Entity()
export class StudyPlan {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  description: string;

  @Field(() => String)
  @Column({ type: 'date' })
  date: Date;

  @Field(() => String)
  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Field(() => String)
  @Column({ type: 'date' })
  endDate: Date;

  @Field()
  @Column()
  studyGoal: string;

  @Field()
  @Column()
  studyTime: string;

  @Field()
  @Column({ default: false })
  completed: boolean;

  @Field()
  @Column()
  statePlan: boolean;

  @Field(() => ID)
  @Column()
  subject_seq: number;

  @Field(() => Subject)
  @ManyToOne(() => Subject, subject => subject.studyPlans)
  @JoinColumn({ name: 'subject_seq' })
  subject: Subject;

  @Field(() => User)
  @ManyToOne(() => User, user => user.studyPlans, {
    onDelete: 'CASCADE' // 사용자 삭제 시 관련 학습 계획도 삭제
  })
  @JoinColumn({ name: 'user_seq' })
  user: User;

  @Field()
  @Column()
  userId: number;

  @Field()
  @CreateDateColumn({ name: 'plan_create_date' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'plan_mode_date' })
  updatedAt: Date;
}

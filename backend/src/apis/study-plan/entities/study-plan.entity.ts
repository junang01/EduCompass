import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
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

  @Field()
  @Column({ default: false })
  completed: boolean;

  @Field(() => ID)
  @Column()
  subject_seq: number;

  @Field(() => Subject)
  @ManyToOne(() => Subject, subject => subject.studyPlans)
  @JoinColumn({ name: 'subject_seq' })
  subject: Subject;

  @Field(() => User)
  @ManyToOne(() => User, user => user.studyPlans)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Field()
  @Column()
  userId: number;

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}

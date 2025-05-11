import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { StudySchedule } from 'src/apis/studySchedule/entities/studySchedule.entity';
import { Subject } from 'src/apis/subject/entities/subject.entity';
import { User } from 'src/apis/users/entities/user.entity';

@ObjectType()
@Entity()
export class StudyPlan {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column()
  title: string;

  @Field(() => String)
  @Column()
  studyGoal: string;

  @Field(() => Boolean)
  @Column()
  statePlan: boolean;

  @Column(() => Number)
  subject_seq: number;

  @Field(() => Number)
  @Column()
  userId: number;

  @ManyToOne(() => Subject, { eager: true })
  @JoinColumn({ name: 'subject_seq' })
  subject: Subject;

  @Field(() => [StudySchedule])
  @OneToMany(() => StudySchedule, (schedule) => schedule.studyPlan)
  schedules: StudySchedule[];

  @Field()
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Field()
  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.studyPlans)
  @JoinColumn({ name: 'userId' })
  user: User;
}
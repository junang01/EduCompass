import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
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
  studyPeriod: string;

  @Field(() => [StudySchedule])
  @OneToMany(() => StudySchedule, (schedule) => schedule.studyPlan)
  schedules: StudySchedule[];

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @JoinColumn({name: 'userId' })
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.studyPlans)
  user: User;
}

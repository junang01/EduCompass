import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { StudyPlan } from 'src/apis/study-plan/entities/study-plan.entity';
import { Subject } from 'src/apis/subject/entities/subject.entity';
import { User } from 'src/apis/users/entities/user.entity';

@ObjectType()
@Entity()
export class StudySchedule {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({ type: 'time' })
  startTime: string;

  @Field(() => String)
  @Column({ type: 'time' })
  endTime: string;

  @JoinColumn()
  @OneToOne(() => Subject)
  @Field(() => Subject)
  subject: Subject;

  @Field(() => String)
  @Column()
  content: string;

  @Field(() => Date)
  @Column({ type: 'date' })
  date: Date;

  @Field()
  @Column({ default: false })
  completed: boolean;

  @JoinColumn()
  @Field()
  @ManyToOne(() => User, (User) => User.studySchedule, { onDelete: 'CASCADE' })
  user: User;

  @JoinColumn()
  @ManyToOne(() => StudyPlan, (studyPlan) => studyPlan.schedules, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @Field(() => StudyPlan)
  studyPlan: StudyPlan;
}

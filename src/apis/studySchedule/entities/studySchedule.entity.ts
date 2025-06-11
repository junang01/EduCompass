import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne, Timestamp } from 'typeorm';
import { StudyPlan } from 'src/apis/study-plan/entities/study-plan.entity';
import { Subject } from 'src/apis/subject/entities/subject.entity';
import { User } from 'src/apis/users/entities/user.entity';

@ObjectType()
@Entity()
export class StudySchedule {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Date)
  @Column({ type: 'timestamp' })
  startTime: Date;

  @Field(() => Date)
  @Column({ type: 'timestamp' })
  endTime: Date;

  @Field(() => Subject, {nullable:true})
  @ManyToOne(() => Subject, { nullable: true })
  subject: Subject;

  @Field(() => String)
  @Column()
  content: string;

  @Field()
  @Column({ default: false })
  completed: boolean;
  
  @Field()
  @Column({default:false})
  delay: boolean

  @JoinColumn()
  @Field(() => User)
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

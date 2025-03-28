import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { StudyPlan } from '../../study-plan/entities/study-plan.entity';

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  email: string;

  @Column()
  password: string;

  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  grade: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  line: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  school: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  receiverEmail: string;

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => StudyPlan, studyPlan => studyPlan.user)
  studyPlans: StudyPlan[];
}

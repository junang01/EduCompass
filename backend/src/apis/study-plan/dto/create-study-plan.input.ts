import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

@InputType()
export class CreateStudyPlanInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  description: string;

  @Field()
  @IsNotEmpty()
  date: Date;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  subject_seq: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  studyGoal: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  studyTime: string;

  @Field({ nullable: true })
  @IsOptional()
  startDate?: Date;

  @Field()
  @IsNotEmpty()
  endDate: Date;

  @Field()
  @IsNotEmpty()
  @IsBoolean()
  statePlan: boolean;
}

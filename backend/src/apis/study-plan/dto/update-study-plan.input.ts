import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsDate, IsOptional, IsNumber, IsBoolean } from 'class-validator';

@InputType()
export class UpdateStudyPlanInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  date?: Date;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  subject_seq?: number;
  
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  studyGoal?: string;
  
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  studyTime?: string;
  
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  statePlan?: boolean;
}

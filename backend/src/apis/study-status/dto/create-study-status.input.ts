import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString, Min, Max } from 'class-validator';

@InputType()
export class CreateStudyStatusInput {
  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  completionRate: number;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  postponeRate: number;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  incompleteRate: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  subject_seq: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  studyPlanId: number;
}

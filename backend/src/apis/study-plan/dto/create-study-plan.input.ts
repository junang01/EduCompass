import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

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
}

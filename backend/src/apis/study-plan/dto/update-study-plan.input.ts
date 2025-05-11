import { InputType, Field, ID, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsDate,
  IsOptional,
  IsNumber,
} from 'class-validator';

@InputType()
export class UpdateStudyPlanInput {
  @Field(() => ID)
  @IsNotEmpty()
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
}

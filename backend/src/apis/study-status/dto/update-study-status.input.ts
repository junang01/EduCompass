import { InputType, Field, ID, Float, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { CreateStudyStatusInput } from './create-study-status.input';

@InputType()
export class UpdateStudyStatusInput extends PartialType(
  CreateStudyStatusInput,
) {
  @Field(() => ID)
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  completionRate?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  postponeRate?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  incompleteRate?: number;
}

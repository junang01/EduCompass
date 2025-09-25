import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@ArgsType()
export class StudyStatusArgs {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  id?: number;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  studyPlanId?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  subject?: string;
}

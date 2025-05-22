import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class CreateStudyStatusInput {
  @Field(() => Int)
  subjectId: number;

  @Field()
  subjectName: string;

  @Field(() => Float)
  completionRate: number;

  @Field(() => Float)
  postponeRate: number;

  @Field(() => Float)
  remainingPeriodPercent: number;

  @Field(() => Int)
  totalSchedules: number;
}
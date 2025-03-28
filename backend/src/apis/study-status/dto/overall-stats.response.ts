import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class SubjectStat {
  @Field()
  subject: string;

  @Field(() => Float)
  completionRate: number;

  @Field(() => Float)
  postponeRate: number;

  @Field(() => Float)
  incompleteRate: number;
}

@ObjectType()
export class OverallStatsResponse {
  @Field(() => Float)
  completionRate: number;

  @Field(() => Float)
  postponeRate: number;

  @Field(() => Float)
  incompleteRate: number;

  @Field(() => [SubjectStat])
  subjectStats: SubjectStat[];
}

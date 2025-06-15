// study-status.output.ts
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Subject } from 'src/apis/subject/entities/subject.entity';
import { StudyPlan } from 'src/apis/study-plan/entities/study-plan.entity';

@ObjectType()
export class StudyStatsOutput {
  @Field(() => Subject, { nullable: true })
  subject?: Subject;

  @Field(() => StudyPlan, { nullable: true })
  studyPlan?: StudyPlan;

  @Field(() => Int)
  totalCount: number;

  @Field(() => Int)
  completedCount: number;

  @Field(() => Int)
  notCompletedCount: number;

  @Field(() => Int)
  delayedCount: number;

  @Field(() => Number)
  completionRate: number;

  @Field(() => Number)
  notCompletionRate: number;

  @Field(() => Number)
  delayRate: number;
}

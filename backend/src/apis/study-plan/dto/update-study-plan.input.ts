import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { AvailableStudyScheduleInput } from './create-study-plan.input';

@InputType()
export class UpdateStudyPlanInput {
  @Field(() => Number)
  studyPlanId: number;

  @Field(() => [AvailableStudyScheduleInput])
  availableStudyScheduleInput: AvailableStudyScheduleInput[];

  @Field(() => [ExamUpdateContentInput])
  examUpdateContentInput: ExamUpdateContentInput[];
}

@InputType()
export class ExamUpdateContentInput {
  @Field(() => String)
  subjectName: string;

  @Field(() => String)
  examcontent: string;

  @Field(() => String)
  examStartDay: string;

  @Field(() => String)
  examLastScore: string;

  @Field(() => String)
  examGoalScore: string;
}
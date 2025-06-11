import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

@InputType()
export class CreateStudyPlanInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  studyPeriod: string;

  @Field(() => [AvailableStudyScheduleInput])
  availableStudyScheduleInput: AvailableStudyScheduleInput[];

  @Field(() => String)
  learningStyle: string;

  @Field(() => [String])
  reviewDays: string[];

  @Field(() => [String])
  missedPlanDays: string[];

  @Field(() => [SubjectInput])
  subjects: SubjectInput[];
}

@InputType()
export class SubjectInput {
  @Field(() => String)
  subject: string;

  @Field(() => [StudyBookInput])
  studyBookInput: StudyBookInput[];

  @Field(() => [ExamContentInput])
  examContentInput: ExamContentInput[];

  @Field(() => String)
  studyLevel: string;
}

@InputType()
export class AvailableStudyScheduleInput {
  @Field(() => String)
  day: string;

  @Field(() => [TimeRangeInput])
  timeRanges: TimeRangeInput[];
}

@InputType()
export class ExamContentInput {
  @Field(() => String)
  examcontent: string;

  @Field(() => String)
  examStartDay: string;

  @Field(() => String)
  examLastScore: string;

  @Field(() => String)
  examGoalScore: string;
}

@InputType()
export class StudyBookInput {
  @Field(() => String)
  bookName: string;

  @Field(() => String)
  bookIndex: string;

  @Field(() => String)
  bookReview: string;
}

@InputType()
export class TimeRangeInput {
  @Field(() => String)
  startTime: string;

  @Field(() => String)
  endTime: string;
}

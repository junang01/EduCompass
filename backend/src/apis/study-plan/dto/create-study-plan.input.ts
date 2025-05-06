import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

@InputType()
export class CreateStudyPlanInput {
  @Field(() => [AvailableStudyScheduleInput])
  availableStudyScheduleInput: AvailableStudyScheduleInput[];

  @Field(() => String)
  studyPeriod: string;

  @Field(() => [ExamContentInput])
  examContentInput: ExamContentInput[];

  @Field(() => [StudyBookInput])
  studyBookInput: StudyBookInput[];

  @Field(() => String)
  studyLevel: string;

  @Field(() => [SubjecctScoreInput])
  lastSemesterScoreInput: SubjecctScoreInput[];

  @Field(() => [SubjecctScoreInput])
  mockExamScoreInput: SubjecctScoreInput[];

  @Field(() => String)
  learningStyle: string;

  @Field(() => [String])
  reviewDays: string[];

  @Field(() => [String])
  missedPlanDay: string[];
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
  examEndDay: string;

  @Field(() => String)
  examGoal: string;
}

@InputType()
export class StudyBookInput {
  @Field(() => String)
  bookName: string;

  @Field(() => String)
  subject: string;

  @Field(() => String)
  bookIndex: string;

  @Field(() => String)
  bookReview: string;
}

@InputType()
export class SubjecctScoreInput {
  @Field(() => String)
  subject: string;

  @Field(() => String)
  score: string;
}

@InputType()
export class TimeRangeInput {
  @Field(() => String)
  startTime: string;

  @Field(() => String)
  endTime: string;
}

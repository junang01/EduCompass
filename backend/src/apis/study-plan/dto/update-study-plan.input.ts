import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { AvailableStudyScheduleInput } from './create-study-plan.input';

@InputType()
export class UpdateStudyPlanInput {
  @Field(() =>Number)
  studyPlanId:number;

  @Field(() =>[AvailableStudyScheduleInput])
  availableStudyScheduleInput: AvailableStudyScheduleInput[];

  @Field(() => [ExamUpdateContentInput])
  examUpdateContentInput:ExamUpdateContentInput[];

  @Field( () => [HomeworkUpdateInput])
  homeworkUpdateInput:HomeworkUpdateInput[];
  

}
@InputType()
export class ExamUpdateContentInput {
  @Field(() => String)
  subjectName: string;

  @Field(() => String)
  examcontent: string;

  @Field(() => String)
  examStartDay: string;
}

@InputType()
export class HomeworkUpdateInput{
  @Field(() => String)
  homeworkName:string;

  @Field(() => String)
  homeworkStartDay: string;

  @Field( () => String)
  homeworkEndDay: string;

  @Field( () => String)
  homeworkContent: string
}

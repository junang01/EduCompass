import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { AvailableStudyScheduleInput } from './create-study-plan.input';

@InputType()
export class UpdateStudyPlanInput {
  @Field(() =>Number)
  studyPlanId:number;

  @Field(() =>[AvailableStudyScheduleInput])
  availableStudyScheduleInput: AvailableStudyScheduleInput;

  @Field(() => String)
  subject
}

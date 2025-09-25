import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateStudyScheduleInput{
    @Field(() => String)
    startTime:string;

    @Field(() => String)
    endTime:string;

    @Field(() => String)
    content:string;
}

@InputType()
export class UpdateScheduleInput {
  @Field(() => Number)
  id: number; // 필수: 어떤 스케줄을 업데이트할지

  @Field(() => String, { nullable: true })
  content?: string;

  @Field(() => Date, { nullable: true })
  startTime?: Date;

  @Field(() => Date, { nullable: true })
  endTime?: Date;
}

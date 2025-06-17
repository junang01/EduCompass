// dto/create-book-survey.dto.ts
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateBookSurveyDto {
  @Field()
  userId: number;

  @Field(() => String)
  answers: string; // 실제로는 JSON 타입, GraphQL에서는 String으로 받아서 파싱
}

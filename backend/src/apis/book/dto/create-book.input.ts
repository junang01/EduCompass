import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateBookInput {
  @Field()
  title: string;

  @Field()
  author: string;

  @Field(() => Int)
  subject_seq: number; // subject 대신 subject_seq 사용

  @Field({ nullable: true })
  publisher?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  difficultyLevel?: string;
}

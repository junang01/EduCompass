import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

@InputType()
export class CreateSubjectInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  subjectName: string;

  @Field({ nullable: true })
  @IsString()
  description?: string;
}

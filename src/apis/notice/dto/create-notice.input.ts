import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

@InputType()
export class CreateNoticeInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  message: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  receiverEmail: string;
}

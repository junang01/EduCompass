import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class SendEmailInput {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  parentEmail: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  reportContent: string; 
}


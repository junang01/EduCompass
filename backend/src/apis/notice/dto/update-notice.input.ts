import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsEmail, IsString, IsOptional } from 'class-validator';

@InputType()
export class UpdateNoticeInput {
  @Field(() => ID)
  @IsNotEmpty()
  id: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  message?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  receiverEmail?: string;
}

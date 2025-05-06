import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  grade?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  line?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  school?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  receiverEmail?: string;
}

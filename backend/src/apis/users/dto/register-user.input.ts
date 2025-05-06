import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class RegisterUserInput {
  @Field()
  @IsNotEmpty({ message: '이름은 필수입니다' })
  name: string;

  @Field()
  @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요' })
  email: string;

  @Field()
  @IsNotEmpty({ message: '비밀번호는 필수입니다' })
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다' })
  password: string;

  @Field({ nullable: true })
  school?: string;

  @Field({ nullable: true })
  grade?: string;

  @Field({ nullable: true })
  line?: string;

  @Field({ nullable: true })
  receiverEmail?: string;
}

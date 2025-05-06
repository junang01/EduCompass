import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class CreateBookSaveDto {
  @Field(() => ID)
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @Field(() => ID)
  @IsNotEmpty()
  @IsNumber()
  bookId: number;
}

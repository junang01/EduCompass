import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class CreateBookRecommendationInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsNumber()
  bookId: number;
}

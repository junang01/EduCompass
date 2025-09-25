import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';

@InputType()
export class UpdateBookRecommendationInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @Field()
  @IsNotEmpty()
  @IsBoolean()
  isFavorite: boolean;
}

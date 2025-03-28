import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsOptional, IsNumber } from 'class-validator';

@ArgsType()
export class BookRecommendationArgs {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsNumber()
  id?: number;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  isFavorite?: boolean;
}

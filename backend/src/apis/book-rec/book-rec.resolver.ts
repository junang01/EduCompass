import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { BookRecommendationService } from './book-rec.service';
import { BookRecommendation } from './entities/book-rec.entity';
import { CreateBookRecommendationInput } from './dto/create-book-rec.input';
import { UpdateBookRecommendationInput } from './dto/update-book-rec.input';
import { BookRecommendationArgs } from './dto/book-rec.args';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Resolver(() => BookRecommendation)
export class BookRecommendationResolver {
  constructor(private readonly bookRecommendationService: BookRecommendationService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [BookRecommendation])
  async bookRecommendations(
    @CurrentUser() user: User, //
    @Args() args: BookRecommendationArgs,
  ): Promise<BookRecommendation[]> {
    return this.bookRecommendationService.findAll(user.id, args);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => BookRecommendation)
  async bookRecommendation(@Args('id', { type: () => Int }) id: number, @CurrentUser() user: User): Promise<BookRecommendation> {
    return this.bookRecommendationService.findOne(id, user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => BookRecommendation)
  async createBookRecommendation(
    @Args('createBookRecommendationInput') createBookRecommendationInput: CreateBookRecommendationInput,
    @CurrentUser() user: User,
  ): Promise<BookRecommendation> {
    return this.bookRecommendationService.create({
      ...createBookRecommendationInput,
      userId: user.id,
    });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => BookRecommendation)
  async updateBookRecommendation(
    @Args('updateBookRecommendationInput') updateBookRecommendationInput: UpdateBookRecommendationInput,
    @CurrentUser() user: User,
  ): Promise<BookRecommendation> {
    return this.bookRecommendationService.update(updateBookRecommendationInput.id, updateBookRecommendationInput, user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async deleteBookRecommendation(@Args('id', { type: () => Int }) id: number, @CurrentUser() user: User): Promise<boolean> {
    return this.bookRecommendationService.delete(id, user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => BookRecommendation)
  async toggleFavorite(@Args('id', { type: () => Int }) id: number, @CurrentUser() user: User): Promise<BookRecommendation> {
    return this.bookRecommendationService.toggleFavorite(id, user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [BookRecommendation])
  async getBookRecommendations(@Args('subject') subject: string, @CurrentUser() user: User): Promise<any[]> {
    return this.bookRecommendationService.getRecommendations(user.id, subject);
  }
}

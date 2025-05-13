import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { BookSaveService } from './booksave.service';
import { BookSave } from './entities/booksave.entity';
import { CreateBookSaveDto } from './dto/create-booksave.dto';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver(() => BookSave)
export class BookSaveResolver {
  constructor(private readonly bookSaveService: BookSaveService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => BookSave)
  createBookSave(@Args('createBookSaveInput') createBookSaveDto: CreateBookSaveDto, @CurrentUser() user: User) {
    // 현재 로그인한 사용자의 ID를 사용
    createBookSaveDto.userId = user.id;
    return this.bookSaveService.create(createBookSaveDto);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [BookSave], { name: 'bookSaves' })
  findAll() {
    return this.bookSaveService.findAll();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [BookSave], { name: 'userBookSaves' })
  findByUser(@CurrentUser() user: User) {
    return this.bookSaveService.findByUser(user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => BookSave, { name: 'bookSave' })
  findOne(@Args('id', { type: () => ID }) id: number) {
    return this.bookSaveService.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  removeBookSave(@Args('id', { type: () => ID }) id: number) {
    return this.bookSaveService.delete(id);
  }
}

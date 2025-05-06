import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { BookSaveService } from './booksave.service';
import { BookSave } from './entities/booksave.entity';
import { CreateBookSaveDto } from './dto/create-booksave.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Resolver(() => BookSave)
export class BookSaveResolver {
  constructor(private readonly bookSaveService: BookSaveService) {}

  @Mutation(() => BookSave)
  @UseGuards(JwtAuthGuard)
  createBookSave(
    @Args('createBookSaveInput') createBookSaveDto: CreateBookSaveDto,
    @CurrentUser() user: User,
  ) {
    // 현재 로그인한 사용자의 ID를 사용
    createBookSaveDto.userId = user.id;
    return this.bookSaveService.create(createBookSaveDto);
  }

  @Query(() => [BookSave], { name: 'bookSaves' })
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.bookSaveService.findAll();
  }

  @Query(() => [BookSave], { name: 'userBookSaves' })
  @UseGuards(JwtAuthGuard)
  findByUser(@CurrentUser() user: User) {
    return this.bookSaveService.findByUser(user.id);
  }

  @Query(() => BookSave, { name: 'bookSave' })
  @UseGuards(JwtAuthGuard)
  findOne(@Args('id', { type: () => ID }) id: number) {
    return this.bookSaveService.findOne(id);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  removeBookSave(@Args('id', { type: () => ID }) id: number) {
    return this.bookSaveService.delete(id);
  }
}

import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './entities/book.entity';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { BookArgs } from './dto/book.args';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { IBook } from './interfaces/book.interface';

@Resolver(() => Book)
export class BookResolver {
  constructor(private readonly bookService: BookService) {}

  @Query(() => [Book])
  async books(@Args() args: BookArgs): Promise<IBook[]> {
    return this.bookService.findAll(args);
  }

  @Query(() => Book)
  async book(@Args('id', { type: () => Int }) id: number): Promise<IBook> {
    return this.bookService.findOne(id);
  }

  @Mutation(() => Book)
  @UseGuards(GqlAuthGuard)
  async createBook(@Args('createBookInput') createBookInput: CreateBookInput): Promise<IBook> {
    return this.bookService.create(createBookInput);
  }

  @Mutation(() => Book)
  @UseGuards(GqlAuthGuard)
  async updateBook(@Args('updateBookInput') updateBookInput: UpdateBookInput): Promise<IBook> {
    return this.bookService.update(updateBookInput.id, updateBookInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteBook(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    return this.bookService.delete(id);
  }

  @Query(() => [Book])
  async booksBySubject(@Args('subject') subject: string): Promise<IBook[]> {
    return this.bookService.findBySubject(subject);
  }
}

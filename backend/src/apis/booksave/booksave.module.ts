import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookSaveService } from './booksave.service';
import { BookSaveResolver } from './booksave.resolver';
import { BookSave } from './entities/booksave.entity';
import { UsersModule } from '../users/users.module';
import { BookModule } from '../book/book.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookSave]),
    UsersModule,
    BookModule
  ],
  providers: [BookSaveResolver, BookSaveService],
  exports: [BookSaveService]
})
export class BookSaveModule {}

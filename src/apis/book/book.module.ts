import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookService } from './book.service';
import { BookResolver } from './book.resolver';
import { Book } from './entities/book.entity';
import { Subject } from '../subject/entities/subject.entity';
import { SubjectModule } from '../subject/subject.module'; 
@Module({
  imports: [
    TypeOrmModule.forFeature([Book, Subject]),
    SubjectModule, 
  ],
  providers: [BookService, BookResolver],
  exports: [BookService],
})
export class BookModule {}

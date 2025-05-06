import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookRecommendation } from './entities/book-rec.entity';
import { Book } from '../book/entities/book.entity';
import { Subject } from '../subject/entities/subject.entity';
import { BookRecommendationService } from './book-rec.service';
import { BookRecommendationResolver } from './book-rec.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookRecommendation, Book, Subject]),
  ],
  providers: [BookRecommendationService, BookRecommendationResolver],
  exports: [BookRecommendationService],
})
export class BookRecommendationModule {}

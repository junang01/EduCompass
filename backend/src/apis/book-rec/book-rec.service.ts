import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookRecommendation } from './entities/book-rec.entity';
import { BookSurvey } from './entities/book-survey.entity';
import { Book } from '../book/entities/book.entity';
import { Subject } from '../subject/entities/subject.entity';
import { IBookRecommendation, IBookRecommendationService } from './interfaces/book-rec.interface';
import { CreateBookSurveyDto } from './dto/create-book-survey.dto';

@Injectable()
export class BookRecommendationService implements IBookRecommendationService {
  constructor(
    @InjectRepository(BookRecommendation)
    private readonly bookRecommendationRepository: Repository<BookRecommendation>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    @InjectRepository(BookSurvey)
    private readonly bookSurveyRepository: Repository<BookSurvey>,
  ) {}

  async findAll(userId: number, args?: any): Promise<BookRecommendation[]> {
    const query = this.bookRecommendationRepository.createQueryBuilder('bookRecommendation')
      .leftJoinAndSelect('bookRecommendation.book', 'book')
      .where('bookRecommendation.userId = :userId', { userId });

    if (args?.isFavorite !== undefined) {
      query.andWhere('bookRecommendation.isFavorite = :isFavorite', { isFavorite: args.isFavorite });
    }

    query.orderBy('bookRecommendation.isFavorite', 'DESC')
         .addOrderBy('bookRecommendation.id', 'DESC');

    return query.getMany();
  }

  async findOne(id: number, userId?: number): Promise<BookRecommendation> {
    const bookRecommendation = await this.bookRecommendationRepository.findOne({
      where: { id },
      relations: ['book'],
    });

    if (!bookRecommendation) {
      throw new NotFoundException(`Book recommendation with ID ${id} not found`);
    }

    if (userId && bookRecommendation.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this recommendation');
    }

    return bookRecommendation;
  }

  async create(bookRecommendation: IBookRecommendation): Promise<BookRecommendation> {
    const book = await this.bookRepository.findOne({ where: { id: bookRecommendation.bookId } });
    if (!book) {
      throw new NotFoundException(`Book with ID ${bookRecommendation.bookId} not found`);
    }

    const existingRecommendation = await this.bookRecommendationRepository.findOne({
      where: {
        userId: bookRecommendation.userId,
        bookId: bookRecommendation.bookId,
      },
    });

    if (existingRecommendation) {
      return existingRecommendation;
    }

    const newBookRecommendation = this.bookRecommendationRepository.create(bookRecommendation);
    return this.bookRecommendationRepository.save(newBookRecommendation);
  }

  async update(id: number, bookRecommendationData: Partial<IBookRecommendation>, userId: number): Promise<BookRecommendation> {
    const bookRecommendation = await this.findOne(id, userId);
    Object.assign(bookRecommendation, bookRecommendationData);
    return this.bookRecommendationRepository.save(bookRecommendation);
  }

  async delete(id: number, userId: number): Promise<boolean> {
    await this.findOne(id, userId);
    const result = await this.bookRecommendationRepository.delete(id);
    return result.affected > 0;
  }

  async toggleFavorite(id: number, userId?: number): Promise<BookRecommendation> {
    const bookRecommendation = await this.findOne(id, userId);
    bookRecommendation.isFavorite = !bookRecommendation.isFavorite;
    return this.bookRecommendationRepository.save(bookRecommendation);
  }

  async getRecommendations(userId: number, subjectName: string): Promise<any[]> {
    const subjectEntity = await this.subjectRepository.findOne({ where: { subjectName } });

    if (!subjectEntity) {
      return [];
    }

    const books = await this.bookRepository.find({
      where: { subject_seq: subjectEntity.id },
      take: 3,
    });

    const recommendations = [];
    for (const book of books) {
      const recommendation = await this.create({
        userId,
        bookId: book.id,
      });

      recommendations.push({
        ...recommendation,
        book,
      });
    }

    return recommendations;
  }

  // 설문 저장 기능
  async saveSurvey(createBookSurveyDto: CreateBookSurveyDto): Promise<BookSurvey> {
    const survey = this.bookSurveyRepository.create({
      ...createBookSurveyDto,
      answers: JSON.parse(createBookSurveyDto.answers),
    });
    return this.bookSurveyRepository.save(survey);
  }
}

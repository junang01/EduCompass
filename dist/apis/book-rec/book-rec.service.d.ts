import { Repository } from 'typeorm';
import { BookRecommendation } from './entities/book-rec.entity';
import { Book } from '../book/entities/book.entity';
import { Subject } from '../subject/entities/subject.entity';
import { IBookRecommendation, IBookRecommendationService } from './interfaces/book-rec.interface';
export declare class BookRecommendationService implements IBookRecommendationService {
    private readonly bookRecommendationRepository;
    private readonly bookRepository;
    private readonly subjectRepository;
    constructor(bookRecommendationRepository: Repository<BookRecommendation>, bookRepository: Repository<Book>, subjectRepository: Repository<Subject>);
    findAll(userId: number, args?: any): Promise<BookRecommendation[]>;
    findOne(id: number, userId?: number): Promise<BookRecommendation>;
    create(bookRecommendation: IBookRecommendation): Promise<BookRecommendation>;
    update(id: number, bookRecommendationData: Partial<IBookRecommendation>, userId: number): Promise<BookRecommendation>;
    delete(id: number, userId: number): Promise<boolean>;
    toggleFavorite(id: number, userId?: number): Promise<BookRecommendation>;
    getRecommendations(userId: number, subjectName: string): Promise<any[]>;
}

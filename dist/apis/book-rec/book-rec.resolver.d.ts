import { BookRecommendationService } from './book-rec.service';
import { BookRecommendation } from './entities/book-rec.entity';
import { CreateBookRecommendationInput } from './dto/create-book-rec.input';
import { UpdateBookRecommendationInput } from './dto/update-book-rec.input';
import { BookRecommendationArgs } from './dto/book-rec.args';
import { User } from '../users/entities/user.entity';
export declare class BookRecommendationResolver {
    private readonly bookRecommendationService;
    constructor(bookRecommendationService: BookRecommendationService);
    bookRecommendations(user: User, args: BookRecommendationArgs): Promise<BookRecommendation[]>;
    bookRecommendation(id: number, user: User): Promise<BookRecommendation>;
    createBookRecommendation(createBookRecommendationInput: CreateBookRecommendationInput, user: User): Promise<BookRecommendation>;
    updateBookRecommendation(updateBookRecommendationInput: UpdateBookRecommendationInput, user: User): Promise<BookRecommendation>;
    deleteBookRecommendation(id: number, user: User): Promise<boolean>;
    toggleFavorite(id: number, user: User): Promise<BookRecommendation>;
    getBookRecommendations(subject: string, user: User): Promise<any[]>;
}

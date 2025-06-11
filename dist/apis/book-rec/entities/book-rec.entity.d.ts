import { User } from '../../users/entities/user.entity';
import { Book } from '../../book/entities/book.entity';
import { Subject } from '../../subject/entities/subject.entity';
export declare class BookRecommendation {
    id: number;
    userId: number;
    user: User;
    bookId: number;
    book: Book;
    subject_seq: number;
    subject: Subject;
    isFavorite: boolean;
    createdAt: Date;
    updatedAt: Date;
}

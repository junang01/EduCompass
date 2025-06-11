import { User } from '../../users/entities/user.entity';
import { Book } from '../../book/entities/book.entity';
export declare class BookSave {
    id: number;
    userId: number;
    bookId: number;
    user: User;
    book: Book;
    createdAt: Date;
}

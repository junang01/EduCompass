import { Book } from '../../book/entities/book.entity';
import { User } from '../../users/entities/user.entity';
export interface IBookSave {
    id: number;
    userId: number;
    bookId: number;
    user?: User;
    book?: Book;
    createdAt: Date;
}
export interface IBookSaveService {
    create(data: {
        userId: number;
        bookId: number;
    }): Promise<IBookSave>;
    findAll(): Promise<IBookSave[]>;
    findByUser(userId: number): Promise<IBookSave[]>;
    findOne(id: number): Promise<IBookSave>;
    delete(id: number): Promise<boolean>;
}

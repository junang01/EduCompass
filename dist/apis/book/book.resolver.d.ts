import { BookService } from './book.service';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { BookArgs } from './dto/book.args';
import { IBook } from './interfaces/book.interface';
export declare class BookResolver {
    private readonly bookService;
    constructor(bookService: BookService);
    books(args: BookArgs): Promise<IBook[]>;
    book(id: number): Promise<IBook>;
    createBook(createBookInput: CreateBookInput): Promise<IBook>;
    updateBook(updateBookInput: UpdateBookInput): Promise<IBook>;
    deleteBook(id: number): Promise<boolean>;
    booksBySubject(subject: string): Promise<IBook[]>;
}

import { BookSaveService } from './booksave.service';
import { BookSave } from './entities/booksave.entity';
import { CreateBookSaveDto } from './dto/create-booksave.dto';
import { User } from '../users/entities/user.entity';
export declare class BookSaveResolver {
    private readonly bookSaveService;
    constructor(bookSaveService: BookSaveService);
    createBookSave(createBookSaveDto: CreateBookSaveDto, user: User): Promise<BookSave>;
    findAll(): Promise<BookSave[]>;
    findByUser(user: User): Promise<BookSave[]>;
    findOne(id: number): Promise<BookSave>;
    removeBookSave(id: number): Promise<boolean>;
}

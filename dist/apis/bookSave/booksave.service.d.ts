import { Repository } from 'typeorm';
import { BookSave } from './entities/booksave.entity';
import { CreateBookSaveDto } from './dto/create-booksave.dto';
import { IBookSaveService } from './interface/booksave.interface';
export declare class BookSaveService implements IBookSaveService {
    private bookSaveRepository;
    constructor(bookSaveRepository: Repository<BookSave>);
    create(createBookSaveDto: CreateBookSaveDto): Promise<BookSave>;
    findAll(): Promise<BookSave[]>;
    findByUser(userId: number): Promise<BookSave[]>;
    findOne(id: number): Promise<BookSave>;
    delete(id: number): Promise<boolean>;
}

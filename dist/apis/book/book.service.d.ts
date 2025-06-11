import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { IBook, IBookService } from './interfaces/book.interface';
import { Subject } from '../subject/entities/subject.entity';
export declare class BookService implements IBookService {
    private readonly bookRepository;
    private readonly subjectRepository;
    constructor(bookRepository: Repository<Book>, subjectRepository: Repository<Subject>);
    findAll(args?: any): Promise<IBook[]>;
    findOne(id: number): Promise<IBook>;
    create(bookData: IBook): Promise<IBook>;
    update(id: number, bookData: Partial<IBook>): Promise<IBook>;
    delete(id: number): Promise<boolean>;
    findBySubject(subject: string): Promise<IBook[]>;
}

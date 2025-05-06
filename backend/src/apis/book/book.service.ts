import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { IBook, IBookService } from './interfaces/book.interface';
import { Subject } from '../subject/entities/subject.entity';

@Injectable()
export class BookService implements IBookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>
  ) {}

  async findAll(args?: any): Promise<IBook[]> {
    const query = this.bookRepository.createQueryBuilder('book')
      .leftJoinAndSelect('book.subject', 'subject');
    
    if (args?.subject) {
      const subject = await this.subjectRepository.findOne({ 
        where: { subjectName: args.subject } 
      });
      if (subject) {
        query.andWhere('book.subject_seq = :subject_seq', { subject_seq: subject.id });
      }
    }
    
    if (args?.title) {
      query.andWhere('book.title LIKE :title', { title: `%${args.title}%` });
    }
    
    if (args?.author) {
      query.andWhere('book.author LIKE :author', { author: `%${args.author}%` });
    }
    
    return query.getMany();
  }

  async findOne(id: number): Promise<IBook> {
    const book = await this.bookRepository.findOne({ 
      where: { id },
      relations: ['subject']
    });
    
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    
    return book;
  }

  async create(bookData: IBook): Promise<IBook> {
    const newBook = this.bookRepository.create(bookData);
    const savedBook = await this.bookRepository.save(newBook);
    return savedBook; 
  }
  

  async update(id: number, bookData: Partial<IBook>): Promise<IBook> {
    const book = await this.findOne(id);
    
    
    const { subject, ...rest } = bookData as any;
    
    
    Object.assign(book, rest);
    
    return this.bookRepository.save(book);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.bookRepository.delete(id);
    return result.affected > 0;
  }

  async findBySubject(subject: string): Promise<IBook[]> {
    
    const subjectEntity = await this.subjectRepository.findOne({ 
      where: { subjectName: subject } 
    });
    
    if (!subjectEntity) {
      return [];
    }
    
    return this.bookRepository.find({ 
      where: { subject_seq: subjectEntity.id },
      relations: ['subject']
    });
  }
}

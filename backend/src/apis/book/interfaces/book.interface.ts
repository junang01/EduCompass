import { Subject } from '../../subject/entities/subject.entity';

export interface IBook {
  id?: number;
  title: string;
  author: string;
  subject_seq: number;
  subject?: Subject; 
  publisher?: string;
  description?: string;
  difficultyLevel?: string;
}

export interface IBookService {
  findAll(args?: any): Promise<IBook[]>;
  findOne(id: number): Promise<IBook>;
  create(book: IBook): Promise<IBook>;
  update(id: number, book: Partial<IBook>): Promise<IBook>;
  delete(id: number): Promise<boolean>;
  findBySubject(subject: string): Promise<IBook[]>;
}

import { BookRecommendation } from '../../book-rec/entities/book-rec.entity';
import { Subject } from '../../subject/entities/subject.entity';
export declare class Book {
    id: number;
    title: string;
    author: string;
    subject_seq: number;
    subject: Subject;
    publisher: string;
    description: string;
    overview: string;
    difficultyLevel: string;
    createdAt: Date;
    updatedAt: Date;
    bookRecommendations: BookRecommendation[];
}

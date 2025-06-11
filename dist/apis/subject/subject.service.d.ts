import { Repository } from 'typeorm';
import { Subject } from './entities/subject.entity';
import { ISubject, ISubjectService, ISubjectServiceFindSubject } from './interfaces/subject.interface';
export declare class SubjectService implements ISubjectService {
    private readonly subjectRepository;
    constructor(subjectRepository: Repository<Subject>);
    findAll(): Promise<Subject[]>;
    findOne(id: number): Promise<Subject>;
    create(subjectName: any): Promise<Subject>;
    update(id: number, subjectData: Partial<ISubject>): Promise<Subject>;
    delete(id: number): Promise<boolean>;
    findOrCreateByName(subjectName: string): Promise<Subject>;
    find({ subjectTitles }: ISubjectServiceFindSubject): Promise<Subject[]>;
}

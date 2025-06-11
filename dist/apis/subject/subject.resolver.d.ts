import { SubjectService } from './subject.service';
import { Subject } from './entities/subject.entity';
import { CreateSubjectInput } from './dto/create-subject.input';
import { UpdateSubjectInput } from './dto/update-subject.input';
export declare class SubjectResolver {
    private readonly subjectService;
    constructor(subjectService: SubjectService);
    subjects(): Promise<Subject[]>;
    subject(id: number): Promise<Subject>;
    createSubject(createSubjectInput: CreateSubjectInput): Promise<Subject>;
    updateSubject(updateSubjectInput: UpdateSubjectInput): Promise<Subject>;
    deleteSubject(id: number): Promise<boolean>;
}

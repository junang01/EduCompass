export interface ISubject {
    id?: number;
    subjectName: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface ISubjectService {
    findAll(): Promise<ISubject[]>;
    findOne(id: number): Promise<ISubject>;
    create(subject: ISubject): Promise<ISubject>;
    update(id: number, subject: Partial<ISubject>): Promise<ISubject>;
    delete(id: number): Promise<boolean>;
}
export interface ISubjectServiceFindSubject {
    subjectTitles: string[];
}

export interface IStudyStatus {
  id?: number;
  completionRate: number;
  postponeRate: number;
  incompleteRate: number;
  subject_seq: number; 
  studyPlanId: number;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}
  
  export interface IStudyStatusService {
    findAll(userId: number, args?: any): Promise<IStudyStatus[]>;
    findOne(id: number, userId: number): Promise<IStudyStatus>;
    create(studyStatus: IStudyStatus): Promise<IStudyStatus>;
    update(id: number, studyStatus: Partial<IStudyStatus>, userId: number): Promise<IStudyStatus>;
    delete(id: number, userId: number): Promise<boolean>;
    getSubjectStats(userId: number, subject: string): Promise<IStudyStatus>;
    getOverallStats(userId: number): Promise<any>;
  }
  
import { User } from "src/apis/users/entities/user.entity";

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
  update(
    id: number,
    studyStatus: Partial<IStudyStatus>,
    userId: number,
  ): Promise<IStudyStatus>;
  delete(id: number, userId: number): Promise<boolean>;
  getSubjectStats(userId: number, subject: string): Promise<IStudyStatus>;
  getOverallStats(userId: number): Promise<any>;
}

export interface IGetStatsByPeriod {
  start: string;      // 'YYYY-MM-DD'
  end: string;        // 'YYYY-MM-DD'
  user: User;
  planId?: number;    // 특정 계획만 보고 싶으면 전달 (옵셔널)
}

export interface IStudyStatusServiceGetStatus{
  id:number,
  user:User
}

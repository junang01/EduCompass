import { CreateStudyPlanInput } from '../dto/create-study-plan.input';

export interface IStudyPlan {
  id?: number;
  title: string;
  description: string;
  date: Date | string;
  completed?: boolean;
  userId: number;
  subject_seq: number;
  user?: any;
  subject?: any;
}

export interface IStudyPlanService {
  findAll(userId?: number, args?: any): Promise<IStudyPlan[]>;
  findOne(id: number): Promise<IStudyPlan>;
  create(studyPlan: IStudyPlan): Promise<IStudyPlan>;
  update(id: number, studyPlan: Partial<IStudyPlan>): Promise<IStudyPlan>;
  delete(id: number): Promise<boolean>;
  complete(id: number): Promise<IStudyPlan>;
  checkDuplicate(date: Date | string, userId: number): Promise<boolean>;
  getCalendarData(userId: number): Promise<any[]>;
  findBySubject(subject_seq: number, userId: number): Promise<IStudyPlan[]>;
}


export interface ICreateStudyPlanService {
  userId: number;
  createStudyPlanInput: CreateStudyPlanInput;
}


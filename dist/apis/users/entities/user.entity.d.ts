import { StudyPlan } from '../../study-plan/entities/study-plan.entity';
import { BookSave } from '../../bookSave/entities/booksave.entity';
import { Notification } from '../../notice/entities/notice.entity';
import { AuthToken } from '../../auth/entities/auth-token.entity';
import { StudySchedule } from 'src/apis/studySchedule/entities/studySchedule.entity';
export declare class User {
    id: number;
    email: string;
    password: string;
    name: string;
    school: string;
    grade: string;
    line: string;
    receiverEmail: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    role: string;
    studyPlans: StudyPlan[];
    bookSaves: BookSave[];
    notifications: Notification[];
    authTokens: AuthToken[];
    studySchedule: StudySchedule[];
}

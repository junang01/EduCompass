import { StudySchedule } from 'src/apis/studySchedule/entities/studySchedule.entity';
import { User } from 'src/apis/users/entities/user.entity';
export declare class StudyPlan {
    id: number;
    title: string;
    studyPeriod: string;
    schedules: StudySchedule[];
    createdAt: Date;
    updatedAt: Date;
    user: User;
}

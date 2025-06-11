import { User } from '../../users/entities/user.entity';
import { StudyPlan } from '../../study-plan/entities/study-plan.entity';
import { Subject } from '../../subject/entities/subject.entity';
export declare class StudyStatus {
    id: number;
    completionRate: number;
    delayRate: number;
    remainingPercent: number;
    subject: Subject;
    studyPlan: StudyPlan;
    user: User;
    createdAt: Date;
    updatedAt: Date;
}

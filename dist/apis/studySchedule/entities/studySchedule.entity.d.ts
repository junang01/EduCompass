import { StudyPlan } from 'src/apis/study-plan/entities/study-plan.entity';
import { Subject } from 'src/apis/subject/entities/subject.entity';
import { User } from 'src/apis/users/entities/user.entity';
export declare class StudySchedule {
    id: number;
    startTime: Date;
    endTime: Date;
    subject: Subject;
    content: string;
    completed: boolean;
    delay: boolean;
    user: User;
    studyPlan: StudyPlan;
}

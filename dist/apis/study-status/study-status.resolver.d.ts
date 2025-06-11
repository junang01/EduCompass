import { StudyStatusService } from './study-status.service';
import { CreateStudyStatusInput } from './dto/create-study-status.input';
import { User } from '../users/entities/user.entity';
export declare class StudyStatusResolver {
    private readonly studyStatusService;
    constructor(studyStatusService: StudyStatusService);
    getStudyStatus(id: number, user: User): Promise<CreateStudyStatusInput[]>;
}

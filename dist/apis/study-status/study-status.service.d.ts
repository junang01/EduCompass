import { Repository } from 'typeorm';
import { IStudyStatusServiceGetStatus } from './interfaces/study-status.interface';
import { StudyPlan } from '../study-plan/entities/study-plan.entity';
import { StudySchedule } from '../studySchedule/entities/studySchedule.entity';
import { CreateStudyStatusInput } from './dto/create-study-status.input';
export declare class StudyStatusService {
    private readonly studyPlanRepository;
    private readonly studyScheduleRepository;
    constructor(studyPlanRepository: Repository<StudyPlan>, studyScheduleRepository: Repository<StudySchedule>);
    getStudyStatusByPlan({ id, user }: IStudyStatusServiceGetStatus): Promise<CreateStudyStatusInput[]>;
}

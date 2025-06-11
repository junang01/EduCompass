import { Repository } from 'typeorm';
import { StudyPlan } from './entities/study-plan.entity';
import { StudySchedule } from '../studyschedule/entities/studyschedule.entity';
import { Subject } from '../subject/entities/subject.entity';
import { SubjectService } from '../subject/subject.service';
import { ChatGptPrompt } from './entities/chatGptPrompt.entity';
import { ICreateStudyPlanService, IStudyPlanServiceFindChatGptPrompt, IStudyPlanServiceFindStudyPlan, IStudyPlanServiceFindStudyPlans } from './interfaces/study-plan.interface';
export declare class StudyPlansService {
    private readonly studyPlanRepository;
    private readonly studyScheduleRepository;
    private readonly subjectRepository;
    private readonly subjectService;
    private readonly chatGptPrompt;
    constructor(studyPlanRepository: Repository<StudyPlan>, studyScheduleRepository: Repository<StudySchedule>, subjectRepository: Repository<Subject>, subjectService: SubjectService, chatGptPrompt: Repository<ChatGptPrompt>);
    createStudyPlan({ userId, createStudyPlanInput }: ICreateStudyPlanService): Promise<StudyPlan>;
    findChatGptPrompt({ promptName }: IStudyPlanServiceFindChatGptPrompt): Promise<string>;
    formatSubject(subjects: any): string;
    findAll({ user }: IStudyPlanServiceFindStudyPlans): Promise<StudyPlan[]>;
    findOne({ studyPlanId, user }: IStudyPlanServiceFindStudyPlan): Promise<StudyPlan>;
}

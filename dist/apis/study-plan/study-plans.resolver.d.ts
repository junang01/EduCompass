import { StudyPlansService } from './study-plans.service';
import { StudyPlan } from './entities/study-plan.entity';
import { CreateStudyPlanInput } from './dto/create-study-plan.input';
import { User } from '../users/entities/user.entity';
import { FeatureUsageService } from '../featureUsage/featureUsage.service';
export declare class StudyPlansResolver {
    private readonly studyPlansService;
    private readonly featureUsageService;
    constructor(studyPlansService: StudyPlansService, featureUsageService: FeatureUsageService);
    createStudyPlan(createStudyPlanInput: CreateStudyPlanInput, user: User): Promise<StudyPlan>;
    findStudyPlans(user: User): Promise<StudyPlan[]>;
    findStudyPlan(studyPlanId: number, user: User): Promise<StudyPlan>;
}

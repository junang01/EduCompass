import { FeatureUsage } from './entities/featureUsage.entity';
import { Repository } from 'typeorm';
import { IFeatureUsageService } from './interfaces/featureUsage.interface';
export declare class FeatureUsageService {
    private readonly featureUsageRepository;
    constructor(featureUsageRepository: Repository<FeatureUsage>);
    canUsage(input: IFeatureUsageService): Promise<FeatureUsage | null>;
    saveUsage(saveFeatureUsageInput: IFeatureUsageService, findUsageReturn?: FeatureUsage | null): Promise<void>;
    findUsage({ userId, featureName }: IFeatureUsageService): Promise<FeatureUsage>;
}

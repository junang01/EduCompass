import { FeatureUsage } from '../entities/featureUsage.entity';

export interface IFeatureUsageService {
  userId: number;
  featureName: string;
}

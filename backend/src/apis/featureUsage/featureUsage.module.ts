import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeatureUsage } from './entities/featureUsage.entity';
import { User } from '../users/entities/user.entity';
import { FeatureUsageService } from './featureUsage.service';

@Module({
  imports: [TypeOrmModule.forFeature([FeatureUsage, User])],
  providers: [FeatureUsageService],
  exports: [FeatureUsageService],
})
export class FeatureUsageModule {}

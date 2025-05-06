import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyPlansService } from './study-plans.service';
import { StudyPlansResolver } from './study-plans.resolver';
import { StudyPlan } from './entities/study-plan.entity';
import { Subject } from '../subject/entities/subject.entity';
import { StudySchedule } from '../studySchedule/entities/studySchedule.entity';
import { SubjectModule } from '../subject/subject.module';
import { FeatureUsage } from '../featureUsage/entities/featureUsage.entity';
import { FeatureUsageService } from '../featureUsage/featureUsage.service';

@Module({
  imports: [TypeOrmModule.forFeature([StudyPlan, Subject, StudySchedule, FeatureUsage]), SubjectModule],

  providers: [StudyPlansResolver, StudyPlansService, FeatureUsageService],
  exports: [StudyPlansService],
})
export class StudyPlanModule {}

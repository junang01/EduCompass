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
import { ChatGptPrompt } from './entities/chatGptPrompt.entity';
import { StudyScheduleService } from '../studySchedule/studyschedule.service';

@Module({
  imports: [TypeOrmModule.forFeature([StudyPlan, Subject, StudySchedule, FeatureUsage, ChatGptPrompt]), SubjectModule],

  providers: [StudyPlansResolver, StudyPlansService, FeatureUsageService,StudyScheduleService],

  exports: [StudyPlansService],
})
export class StudyPlanModule {}

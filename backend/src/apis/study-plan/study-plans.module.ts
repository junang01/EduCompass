import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyPlansService } from './study-plans.service';
import { StudyPlansResolver } from './study-plan.resolver';
import { StudyPlan } from './entities/study-plan.entity';
import { Subject } from '../subject/entities/subject.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudyPlan, Subject])
  ],
  providers: [StudyPlansResolver, StudyPlansService],
  exports: [StudyPlansService],
})
export class StudyPlanModule {}

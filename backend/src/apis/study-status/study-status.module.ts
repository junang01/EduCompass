import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyStatus } from './entities/studyStatus.entity';
import { StudyStatusService } from './study-status.service';
import { StudyStatusResolver } from './study-status.resolver';
import { Subject } from '../subject/entities/subject.entity';
import { StudySchedule } from '../studySchedule/entities/studySchedule.entity';
import { StudyPlan } from '../study-plan/entities/study-plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudyStatus, Subject, StudySchedule, StudyPlan])],
  providers: [StudyStatusService, StudyStatusResolver],
  exports: [StudyStatusService],
})
export class StudyStatusModule {}

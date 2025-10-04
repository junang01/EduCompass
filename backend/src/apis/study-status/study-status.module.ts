import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyStatusService } from './study-status.service';
import { StudyStatusResolver } from './study-status.resolver';
import { StudyStatus } from './entities/study-status.entity';
import { StudyPlan } from '../study-plan/entities/study-plan.entity';
import { Subject } from '../subject/entities/subject.entity';
import { StudySchedule } from '../studySchedule/entities/studySchedule.entity'; // ✅ 추가

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudyStatus,
      StudyPlan,
      Subject,
      StudySchedule, // ✅ 반드시 추가!
    ]),
  ],
  providers: [StudyStatusService, StudyStatusResolver],
  exports: [StudyStatusService],
})
export class StudyStatusModule {}

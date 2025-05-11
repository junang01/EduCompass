import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyStatus } from './entities/study-status.entity';
import { StudyStatusService } from './study-status.service';
import { StudyStatusResolver } from './study-status.resolver';
import { Subject } from '../subject/entities/subject.entity';
import { StudySchedule } from '../studyschedule/entities/studyschedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudyStatus, Subject])],
  providers: [StudyStatusService, StudyStatusResolver],
  exports: [StudyStatusService],
})
export class StudyStatusModule {}

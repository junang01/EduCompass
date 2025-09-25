import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudyStatus } from './entities/study-status.entity';
import { Subject } from '../subject/entities/subject.entity';
import {IStudyStatusServiceGetStatus } from './interfaces/study-status.interface';
import { OverallStatsResponse } from './dto/overall-stats.response';
import { StudyPlan } from '../study-plan/entities/study-plan.entity';
import { StudySchedule } from '../studySchedule/entities/studySchedule.entity';
import { CreateStudyStatusInput } from './dto/create-study-status.input';
@Injectable()
export class StudyStatusService {
  constructor(
    @InjectRepository(StudyPlan)
    private readonly studyPlanRepository: Repository<StudyPlan>,
    @InjectRepository(StudySchedule)
    private readonly studyScheduleRepository: Repository<StudySchedule>,
  ) {}

  async getStudyStatusByPlan({id, user}:IStudyStatusServiceGetStatus):Promise<CreateStudyStatusInput[]> {
 
    const plan = await this.studyPlanRepository.findOne({
      where: { id, user: { id: user.id } },
      relations: ['schedules', 'schedules.subject'],
    });

    if (!plan) {
      throw new NotFoundException('해당 계획이 없습니다/');
    }

    const [startStr, endStr] = plan.studyPeriod.split('to').map(s => s.trim());
    const startDate = new Date(startStr);
    const endDate = new Date(endStr);
    const today = new Date();

    // 3. schedules를 과목별로 그룹핑
    const schedulesBySubject = plan.schedules.reduce((acc, schedule) => {

      if (!schedule.subject) return acc;
      const subjectId = schedule.subject.id;
      if (!acc[subjectId]) acc[subjectId] = [];
      acc[subjectId].push(schedule);
      return acc;
    }, {} as Record<number, StudySchedule[]>);

    // 4. 결과 배열 구성
    const result = [];

    for (const subjectId in schedulesBySubject) {
      const schedules = schedulesBySubject[subjectId];
      const total = schedules.length;

      const completedCount = schedules.filter(s => s.completed).length;
      const delayCount = schedules.filter(s => s.delay).length;

      const completionRate = total === 0 ? 0 : (completedCount / total) * 100;
      const postponeRate = total === 0 ? 0 : (delayCount / total) * 100;

      let remainingPeriodPercent = 0;
      if (today < startDate) remainingPeriodPercent = 0;
      else if (today > endDate) remainingPeriodPercent = 100;
      else {
        const elapsed = today.getTime() - startDate.getTime();
        const totalDuration = endDate.getTime() - startDate.getTime();
        remainingPeriodPercent = (elapsed / totalDuration) * 100;
      }

      result.push({
        subjectId: Number(subjectId),
        subjectName: schedules[0].subject.subjectName,  // 이름 추가 (optional)
        completionRate,
        postponeRate,
        remainingPeriodPercent,
        totalSchedules: total,
      });
    }

    return result;
  

  // async findAll(userId: number, args?: any): Promise<StudyStatus[]> {
  //   const query = this.studyStatusRepository.createQueryBuilder('studyStatus').where('studyStatus.userId = :userId', { userId });

  //   if (args?.subject) {
  //     query.andWhere('studyStatus.subject = :subject', {
  //       subject: args.subject,
  //     });
  //   }

  //   if (args?.studyPlanId) {
  //     query.andWhere('studyStatus.studyPlanId = :studyPlanId', {
  //       studyPlanId: args.studyPlanId,
  //     });
  //   }

  //   return query.getMany();
  // }

  // async findOne(id: number, userId: number): Promise<StudyStatus> {
  //   const studyStatus = await this.studyStatusRepository.findOne({
  //     where: { id },
  //   });

  //   if (!studyStatus) {
  //     throw new NotFoundException(`Study status with ID ${id} not found`);
  //   }

  //   if (studyStatus.userId !== userId) {
  //     throw new ForbiddenException('You do not have permission to access this study status');
  //   }
  //   return studyStatus;
  // }

  // async create(studyStatus: IStudyStatus): Promise<StudyStatus> {
  //   const newStudyStatus = this.studyStatusRepository.create(studyStatus);
  //   return this.studyStatusRepository.save(newStudyStatus);
  // }

  // async update(id: number, studyStatusData: Partial<IStudyStatus>, userId: number): Promise<StudyStatus> {
  //   const studyStatus = await this.findOne(id, userId);

  //   Object.assign(studyStatus, studyStatusData);

  //   return this.studyStatusRepository.save(studyStatus);
  // }

  // async delete(id: number, userId: number): Promise<boolean> {
  //   await this.findOne(id, userId);

  //   const result = await this.studyStatusRepository.delete(id);
  //   return result.affected > 0;
  // }

  // async getSubjectStats(userId: number, subjectName: string): Promise<IStudyStatus> {
  //   const subjectEntity = await this.subjectRepository.findOne({
  //     where: { subjectName },
  //   });

  //   if (!subjectEntity) {
  //     return {
  //       id: 0,
  //       userId,
  //       subject_seq: 0,
  //       completionRate: 0,
  //       postponeRate: 0,
  //       incompleteRate: 0,
  //       studyPlanId: 0,
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //     } as unknown as IStudyStatus;
  //   }

  //   const studyStatus = await this.studyStatusRepository.findOne({
  //     where: { userId, subject_seq: subjectEntity.id },
  //   });

  //   if (!studyStatus) {
  //     return {
  //       id: 0,
  //       userId,
  //       subject_seq: subjectEntity.id,
  //       completionRate: 0,
  //       postponeRate: 0,
  //       incompleteRate: 0,
  //       studyPlanId: 0,
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //     } as unknown as IStudyStatus;
  //   }

  //   return studyStatus;
  // }

  // async getOverallStats(userId: number): Promise<OverallStatsResponse> {
  //   const stats = await this.studyStatusRepository.find({
  //     where: { userId },
  //   });

  //   if (stats.length === 0) {
  //     return {
  //       completionRate: 0,
  //       postponeRate: 0,
  //       incompleteRate: 0,
  //       subjectStats: [],
  //     };
  //   }

  //   const totalCompletionRate = stats.reduce((sum, stat) => sum + stat.completionRate, 0) / stats.length;
  //   const totalPostponeRate = stats.reduce((sum, stat) => sum + stat.postponeRate, 0) / stats.length;
  //   const totalIncompleteRate = stats.reduce((sum, stat) => sum + stat.incompleteRate, 0) / stats.length;

  //   const subjectStats = await Promise.all(
  //     stats.map(async (stat) => {
  //       const subject = await this.subjectRepository.findOne({
  //         where: { id: stat.subjectId },
  //       });
  //       return {
  //         subject: subject ? subject.subjectName : 'Unknown',
  //         completionRate: stat.completionRate,
  //         postponeRate: stat.postponeRate,
  //         incompleteRate: stat.incompleteRate,
  //       };
  //     }),
  //   );

  //   return {
  //     completionRate: totalCompletionRate,
  //     postponeRate: totalPostponeRate,
  //     incompleteRate: totalIncompleteRate,
  //     subjectStats,
  //   };
  // }
}
}
// src/apis/study-status/study-status.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudyStatus } from './entities/study-status.entity';
import { Subject } from '../subject/entities/subject.entity';
import { IStudyStatusServiceGetStatus, IGetStatsByPeriod } from './interfaces/study-status.interface';
import { StudyPlan } from '../study-plan/entities/study-plan.entity';
import { StudySchedule } from '../studySchedule/entities/studySchedule.entity';
import { CreateStudyStatusInput } from './dto/create-study-status.input';
import { OverallStatsResponse } from './dto/overall-stats.response';

@Injectable()
export class StudyStatusService {
  constructor(
    @InjectRepository(StudyPlan)
    private readonly studyPlanRepository: Repository<StudyPlan>,
    @InjectRepository(StudySchedule)
    private readonly studyScheduleRepository: Repository<StudySchedule>,
    @InjectRepository(StudyStatus)
    private readonly studyStatusRepository: Repository<StudyStatus>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  /** 계획 생성 직후(또는 스케줄 상태 변경 직후) 과목별 현황을 재계산해서 upsert */
  async recomputeStatusesForPlan(planId: number, userId: number): Promise<void> {
    const plan = await this.studyPlanRepository.findOne({
      where: { id: planId, user: { id: userId } },
      relations: ['schedules', 'schedules.subject', 'user'],
    });
    if (!plan) throw new NotFoundException('해당 계획이 없습니다.');

    // studyPeriod 파싱
    const [startStr, endStr] = plan.studyPeriod.split('to').map((s) => s.trim());
    const startDate = new Date(startStr);
    const endDate = new Date(endStr);
    const today = new Date();

    const elapsedPercent = (() => {
      if (today <= startDate) return 0;
      if (today >= endDate) return 100;
      const elapsed = today.getTime() - startDate.getTime();
      const total = endDate.getTime() - startDate.getTime();
      return (elapsed / total) * 100;
    })();

    // 과목별 그룹핑
    const schedulesBySubject = plan.schedules.reduce((acc, s) => {
      const subjectId = s.subject?.id;
      if (!subjectId) return acc;
      (acc[subjectId] ||= []).push(s);
      return acc;
    }, {} as Record<number, StudySchedule[]>);

    for (const subjectIdStr of Object.keys(schedulesBySubject)) {
      const subjectId = Number(subjectIdStr);
      const list = schedulesBySubject[subjectId];
      const total = list.length || 1;

      // ✅ 여기서 boolean 필드 기준으로 계산
      const done = list.filter((s) => s.completed === true).length;
      const postponed = list.filter((s) => s.delay === true).length;

      const completionRate = (done / total) * 100;
      const postponeRate = (postponed / total) * 100;

      await this.studyStatusRepository.save({
        user: plan.user,
        studyPlan: plan,
        subject: { id: subjectId } as any,
        completionRate,
        delayRate: postponeRate,
        remainingPercent: elapsedPercent,
      });
    }
  }

  /** 프론트 조회용 */
  async getStudyStatusByPlan({ id, user }: IStudyStatusServiceGetStatus): Promise<CreateStudyStatusInput[]> {
    const plan = await this.studyPlanRepository.findOne({
      where: { id, user: { id: user.id } },
      relations: ['schedules', 'schedules.subject'],
    });
    if (!plan) throw new NotFoundException('해당 계획이 없습니다/');

    const [startStr, endStr] = plan.studyPeriod.split('to').map((s) => s.trim());
    const startDate = new Date(startStr);
    const endDate = new Date(endStr);
    const today = new Date();

    const elapsedPercent = (() => {
      if (today <= startDate) return 0;
      if (today >= endDate) return 100;
      const elapsed = today.getTime() - startDate.getTime();
      const total = endDate.getTime() - startDate.getTime();
      return (elapsed / total) * 100;
    })();

    const schedulesBySubject = plan.schedules.reduce((acc, schedule) => {
      if (!schedule.subject) return acc;
      const subjectId = schedule.subject.id;
      (acc[subjectId] ||= []).push(schedule);
      return acc;
    }, {} as Record<number, StudySchedule[]>);

    const result: CreateStudyStatusInput[] = [];

    for (const subjectIdStr of Object.keys(schedulesBySubject)) {
      const subjectId = Number(subjectIdStr);
      const schedules = schedulesBySubject[subjectId];
      const total = schedules.length || 1;

      // ✅ boolean 필드 기준으로 계산
      const done = schedules.filter((s) => s.completed === true).length;
      const postponed = schedules.filter((s) => s.delay === true).length;

      result.push({
        subjectId,
        subjectName: schedules[0].subject.subjectName,
        completionRate: (done / total) * 100,
        postponeRate: (postponed / total) * 100,
        remainingPeriodPercent: elapsedPercent,
        totalSchedules: total,
      });
    }

    return result;
  }

    async getStatsByPeriod({ start, end, user, planId }: IGetStatsByPeriod): Promise<OverallStatsResponse> {
    // 날짜 범위 (하루 전체 포함)
    const startDate = new Date(`${start}T00:00:00.000Z`);
    const endDate = new Date(`${end}T23:59:59.999Z`);

    // 기간에 "겹치는" 일정만 추출: startTime <= end AND endTime >= start
    const qb = this.studyScheduleRepository
      .createQueryBuilder('sch')
      .leftJoinAndSelect('sch.subject', 'subject')
      .leftJoinAndSelect('sch.studyPlan', 'plan')
      .leftJoin('plan.user', 'user')
      .where('user.id = :userId', { userId: user.id })
      .andWhere('sch.startTime <= :endDate', { endDate })
      .andWhere('sch.endTime >= :startDate', { startDate });

    if (planId) {
      qb.andWhere('plan.id = :planId', { planId });
    }

    const schedules = await qb.getMany();

    // 과목별 집계
    type Bucket = { total: number; done: number; postponed: number; pending: number };
    const acc: Record<string, Bucket> = {};

    for (const s of schedules) {
      const key = s.subject?.subjectName ?? '기타';
      if (!acc[key]) acc[key] = { total: 0, done: 0, postponed: 0, pending: 0 };
      acc[key].total += 1;
      if (s.completed) acc[key].done += 1;
      else if (s.delay) acc[key].postponed += 1;
      else acc[key].pending += 1;
    }

    // 과목별 비율
    const subjectStats = Object.entries(acc).map(([subject, v]) => {
      const t = v.total || 1;
      return {
        subject,
        completionRate: (v.done / t) * 100,
        postponeRate: (v.postponed / t) * 100,
        incompleteRate: (v.pending / t) * 100,
      };
    });

    // 전체(가중 평균)
    const totalAll = schedules.length || 1;
    const doneAll = schedules.filter(s => s.completed).length;
    const postponedAll = schedules.filter(s => s.delay).length;
    const pendingAll = totalAll - doneAll - postponedAll;

    return {
      completionRate: (doneAll / totalAll) * 100,
      postponeRate: (postponedAll / totalAll) * 100,
      incompleteRate: (pendingAll / totalAll) * 100,
      subjectStats,
    };
  }
}

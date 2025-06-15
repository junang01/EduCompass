import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm'; // <-- 'In' 임포트 추가!
import { User } from '../users/entities/user.entity';
import { StudyStatsOutput } from './dto/study-status.outputs';
import { StudySchedule } from '../studySchedule/entities/studySchedule.entity'; // 경로 확인
import { Subject } from '../subject/entities/subject.entity'; // Subject 엔티티 필요
import { StudyPlan } from '../study-plan/entities/study-plan.entity'; // StudyPlan 엔티티 필요

@Injectable()
export class StudyStatusService {
  constructor(
    @InjectRepository(StudySchedule)
    private readonly scheduleRepo: Repository<StudySchedule>,
    @InjectRepository(Subject)
    private readonly subjectRepo: Repository<Subject>,
    @InjectRepository(StudyPlan)
    private readonly studyPlanRepo: Repository<StudyPlan>,
  ) {}

  async getStatsBySubject(user: User): Promise<StudyStatsOutput[]> {
    const schedules = await this.scheduleRepo.find({
      where: { user: { id: user.id } },
      relations: ['subject'],
    });

    if (schedules.length === 0) {
      return [];
    }

    const statsMap = new Map<number | null, { total: number; completed: number; notCompleted: number; delayed: number; }>();
    const subjectIdsToFetch = new Set<number>();

    for (const schedule of schedules) {
      const subjectId = schedule.subject ? schedule.subject.id : null;
      if (subjectId !== null) {
        subjectIdsToFetch.add(subjectId);
      }
      
      if (!statsMap.has(subjectId)) {
        statsMap.set(subjectId, { total: 0, completed: 0, notCompleted: 0, delayed: 0 });
      }
      const stat = statsMap.get(subjectId);
      stat.total++;
      if (schedule.completed) stat.completed++;
      else stat.notCompleted++;
      if (schedule.delay) stat.delayed++;
    }

    // --- 수정된 부분: In 연산자 사용 ---
    const subjects = subjectIdsToFetch.size > 0 
      ? await this.subjectRepo.find({ where: { id: In(Array.from(subjectIdsToFetch)) } }) // <-- 여기를 수정했습니다.
      : [];
    const subjectMap = new Map(subjects.map(s => [s.id, s]));

    const results: StudyStatsOutput[] = [];
    for (const [subjectId, statData] of statsMap.entries()) {
      const total = statData.total;
      const completed = statData.completed;
      const notCompleted = statData.notCompleted;
      const delayed = statData.delayed;

      const subject = subjectMap.get(subjectId);

      results.push({
        subject: subject || { id: subjectId, subjectName: 'Unknown Subject' } as any,
        totalCount: total,
        completedCount: completed,
        notCompletedCount: notCompleted,
        delayedCount: delayed,
        completionRate: total > 0 ? +(completed / total * 100).toFixed(2) : 0,
        notCompletionRate: total > 0 ? +(notCompleted / total * 100).toFixed(2) : 0,
        delayRate: total > 0 ? +(delayed / total * 100).toFixed(2) : 0,
      });
    }

    return results;
  }

  async getStatsByStudyPlan(user: User): Promise<StudyStatsOutput[]> {
    const schedules = await this.scheduleRepo.find({
      where: { user: { id: user.id } },
      relations: ['studyPlan'],
    });

    if (schedules.length === 0) {
      return [];
    }

    const statsMap = new Map<number | null, { total: number; completed: number; notCompleted: number; delayed: number; }>();
    const studyPlanIdsToFetch = new Set<number>();

    for (const schedule of schedules) {
      const studyPlanId = schedule.studyPlan ? schedule.studyPlan.id : null;
      if (studyPlanId !== null) {
        studyPlanIdsToFetch.add(studyPlanId);
      }

      if (!statsMap.has(studyPlanId)) {
        statsMap.set(studyPlanId, { total: 0, completed: 0, notCompleted: 0, delayed: 0 });
      }
      const stat = statsMap.get(studyPlanId);
      stat.total++;
      if (schedule.completed) stat.completed++;
      else stat.notCompleted++;
      if (schedule.delay) stat.delayed++;
    }

    // --- 수정된 부분: In 연산자 사용 ---
    const studyPlans = studyPlanIdsToFetch.size > 0 
      ? await this.studyPlanRepo.find({ where: { id: In(Array.from(studyPlanIdsToFetch)) } }) // <-- 여기를 수정했습니다.
      : [];
    const studyPlanMap = new Map(studyPlans.map(sp => [sp.id, sp]));


    const results: StudyStatsOutput[] = [];
    for (const [studyPlanId, statData] of statsMap.entries()) {
      const total = statData.total;
      const completed = statData.completed;
      const notCompleted = statData.notCompleted;
      const delayed = statData.delayed;

      const studyPlan = studyPlanMap.get(studyPlanId);

      results.push({
        studyPlan: studyPlan || { id: studyPlanId, title: 'Unknown Study Plan' } as any,
        totalCount: total,
        completedCount: completed,
        notCompletedCount: notCompleted,
        delayedCount: delayed,
        completionRate: total > 0 ? +(completed / total * 100).toFixed(2) : 0,
        notCompletionRate: total > 0 ? +(notCompleted / total * 100).toFixed(2) : 0,
        delayRate: total > 0 ? +(delayed / total * 100).toFixed(2) : 0,
      });
    }

    return results;
  }

  async getStatsByDateRange(user: User, startDate: Date, endDate: Date): Promise<StudyStatsOutput> {
    const schedules = await this.scheduleRepo.find({
      where: {
        user: { id: user.id },
        startTime: Between(startDate, endDate),
      },
    });

    let total = 0;
    let completed = 0;
    let notCompleted = 0;
    let delayed = 0;

    for (const schedule of schedules) {
      total++;
      if (schedule.completed) completed++;
      else notCompleted++;
      if (schedule.delay) delayed++;
    }

    if (total === 0) {
      return {
        totalCount: 0,
        completedCount: 0,
        notCompletedCount: 0,
        delayedCount: 0,
        completionRate: 0,
        notCompletionRate: 0,
        delayRate: 0,
      };
    }

    return {
      totalCount: total,
      completedCount: completed,
      notCompletedCount: notCompleted,
      delayedCount: delayed,
      completionRate: +(completed / total * 100).toFixed(2),
      notCompletionRate: +(notCompleted / total * 100).toFixed(2),
      delayRate: +(delayed / total * 100).toFixed(2),
    };
  }
}
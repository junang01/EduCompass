import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudyStatus } from './entities/study-status.entity';
import { Subject } from '../subject/entities/subject.entity';
import {
  IStudyStatus,
  IStudyStatusService,
} from './interfaces/study-status.interface';
import { OverallStatsResponse } from './dto/overall-stats.response';

@Injectable()
export class StudyStatusService implements IStudyStatusService {
  constructor(
    @InjectRepository(StudyStatus)
    private readonly studyStatusRepository: Repository<StudyStatus>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  async findAll(userId: number, args?: any): Promise<StudyStatus[]> {
    const query = this.studyStatusRepository
      .createQueryBuilder('studyStatus')
      .where('studyStatus.userId = :userId', { userId });

    if (args?.subject) {
      query.andWhere('studyStatus.subject = :subject', {
        subject: args.subject,
      });
    }

    if (args?.studyPlanId) {
      query.andWhere('studyStatus.studyPlanId = :studyPlanId', {
        studyPlanId: args.studyPlanId,
      });
    }

    return query.getMany();
  }

  async findOne(id: number, userId: number): Promise<StudyStatus> {
    const studyStatus = await this.studyStatusRepository.findOne({
      where: { id },
    });

    if (!studyStatus) {
      throw new NotFoundException(`Study status with ID ${id} not found`);
    }

    if (studyStatus.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this study status',
      );
    }

    return studyStatus;
  }

  async create(studyStatus: IStudyStatus): Promise<StudyStatus> {
    const newStudyStatus = this.studyStatusRepository.create(studyStatus);
    return this.studyStatusRepository.save(newStudyStatus);
  }

  async update(
    id: number,
    studyStatusData: Partial<IStudyStatus>,
    userId: number,
  ): Promise<StudyStatus> {
    const studyStatus = await this.findOne(id, userId);

    Object.assign(studyStatus, studyStatusData);

    return this.studyStatusRepository.save(studyStatus);
  }

  async delete(id: number, userId: number): Promise<boolean> {
    await this.findOne(id, userId);

    const result = await this.studyStatusRepository.delete(id);
    return result.affected > 0;
  }

  async getSubjectStats(
    userId: number,
    subjectName: string,
  ): Promise<IStudyStatus> {
    const subjectEntity = await this.subjectRepository.findOne({
      where: { subjectName },
    });

    if (!subjectEntity) {
      return {
        id: 0,
        userId,
        subject_seq: 0,
        completionRate: 0,
        postponeRate: 0,
        incompleteRate: 0,
        studyPlanId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as IStudyStatus;
    }

    const studyStatus = await this.studyStatusRepository.findOne({
      where: { userId, subject_seq: subjectEntity.id },
    });

    if (!studyStatus) {
      return {
        id: 0,
        userId,
        subject_seq: subjectEntity.id,
        completionRate: 0,
        postponeRate: 0,
        incompleteRate: 0,
        studyPlanId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as IStudyStatus;
    }

    return studyStatus;
  }

  async getOverallStats(userId: number): Promise<OverallStatsResponse> {
    const stats = await this.studyStatusRepository.find({
      where: { userId },
    });

    if (stats.length === 0) {
      return {
        completionRate: 0,
        postponeRate: 0,
        incompleteRate: 0,
        subjectStats: [],
      };
    }

    const totalCompletionRate =
      stats.reduce((sum, stat) => sum + stat.completionRate, 0) / stats.length;
    const totalPostponeRate =
      stats.reduce((sum, stat) => sum + stat.postponeRate, 0) / stats.length;
    const totalIncompleteRate =
      stats.reduce((sum, stat) => sum + stat.incompleteRate, 0) / stats.length;

    const subjectStats = await Promise.all(
      stats.map(async (stat) => {
        const subject = await this.subjectRepository.findOne({
          where: { id: stat.subject_seq },
        });
        return {
          subject: subject ? subject.subjectName : 'Unknown',
          completionRate: stat.completionRate,
          postponeRate: stat.postponeRate,
          incompleteRate: stat.incompleteRate,
        };
      }),
    );

    return {
      completionRate: totalCompletionRate,
      postponeRate: totalPostponeRate,
      incompleteRate: totalIncompleteRate,
      subjectStats,
    };
  }
}

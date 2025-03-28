import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudyPlan } from './entities/study-plan.entity';
import { Subject } from '../subject/entities/subject.entity';
import { IStudyPlan, IStudyPlanService } from './interface/study-plan.interface';

@Injectable()
export class StudyPlansService implements IStudyPlanService {
  constructor(
    @InjectRepository(StudyPlan)
    private readonly studyPlanRepository: Repository<StudyPlan>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>
  ) {}

  async findAll(userId?: number, args?: any): Promise<IStudyPlan[]> {
    const query = this.studyPlanRepository.createQueryBuilder('studyPlan')
      .leftJoinAndSelect('studyPlan.user', 'user')
      .leftJoinAndSelect('studyPlan.subject', 'subject');
    
    if (userId) {
      query.where('studyPlan.userId = :userId', { userId });
    }
    
    if (args?.subject_seq) {
      query.andWhere('studyPlan.subject_seq = :subject_seq', { subject_seq: args.subject_seq });
    }
    
    if (args?.completed !== undefined) {
      query.andWhere('studyPlan.completed = :completed', { completed: args.completed });
    }
    
    if (args?.startDate && args?.endDate) {
      query.andWhere('studyPlan.date BETWEEN :startDate AND :endDate', { 
        startDate: args.startDate, 
        endDate: args.endDate 
      });
    }
    
    return query.getMany();
  }

  async findOne(id: number): Promise<IStudyPlan> {
    const studyPlan = await this.studyPlanRepository.findOne({ 
      where: { id },
      relations: ['user', 'subject']
    });
    
    if (!studyPlan) {
      throw new NotFoundException(`Study plan with ID ${id} not found`);
    }
    
    return studyPlan;
  }

  async create(studyPlanData: IStudyPlan): Promise<IStudyPlan> {
    
    if (typeof studyPlanData.date === 'string') {
      studyPlanData.date = new Date(studyPlanData.date);
    }
    
    
    if (studyPlanData.subject_seq) {
      const subject = await this.subjectRepository.findOne({
        where: { id: studyPlanData.subject_seq }
      });
      
      if (!subject) {
        throw new NotFoundException(`Subject with ID ${studyPlanData.subject_seq} not found`);
      }
    }
    
    const newStudyPlan = this.studyPlanRepository.create(studyPlanData);
    return this.studyPlanRepository.save(newStudyPlan);
  }

  async update(id: number, studyPlanData: Partial<IStudyPlan>): Promise<IStudyPlan> {
    const studyPlan = await this.findOne(id);
    
    
    if (studyPlanData.id) {
      delete studyPlanData.id;
    }
    
    
    if (studyPlanData.date && typeof studyPlanData.date === 'string') {
      studyPlanData.date = new Date(studyPlanData.date);
    }
    
    
    if (studyPlanData.subject_seq) {
      const subject = await this.subjectRepository.findOne({
        where: { id: studyPlanData.subject_seq }
      });
      
      if (!subject) {
        throw new NotFoundException(`Subject with ID ${studyPlanData.subject_seq} not found`);
      }
    }
    
    
    Object.assign(studyPlan, studyPlanData);
    
    return this.studyPlanRepository.save(studyPlan);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.studyPlanRepository.delete(id);
    return result.affected > 0;
  }

  async complete(id: number): Promise<IStudyPlan> {
    const studyPlan = await this.findOne(id);
    studyPlan.completed = true;
    return this.studyPlanRepository.save(studyPlan);
  }

  async checkDuplicate(date: Date | string, userId: number): Promise<boolean> {
    
    const formattedDate = typeof date === 'string' ? new Date(date) : date;
    
    const existingPlan = await this.studyPlanRepository.findOne({ 
      where: { 
        date: formattedDate, 
        userId 
      } 
    });
    return !!existingPlan;
  }

  async getCalendarData(userId: number): Promise<any[]> {
    const plans = await this.studyPlanRepository.find({ 
      where: { userId },
      relations: ['subject']
    });
    
    return plans.map(plan => ({
      id: plan.id,
      title: plan.title,
      start: plan.date,
      end: plan.date,
      completed: plan.completed,
      subject: plan.subject ? plan.subject.subjectName : null,
      subject_seq: plan.subject_seq
    }));
  }
  
  async findBySubject(subject_seq: number, userId: number): Promise<IStudyPlan[]> {
    return this.studyPlanRepository.find({
      where: {
        subject_seq,
        userId
      },
      relations: ['user', 'subject']
    });
  }
}

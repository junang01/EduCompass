import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './entities/subject.entity';
import { ISubject, ISubjectService } from './interfaces/subject.interface';

@Injectable()
export class SubjectService implements ISubjectService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  async findAll(): Promise<Subject[]> {
    return this.subjectRepository.find();
  }

  async findOne(id: number): Promise<Subject> {
    const subject = await this.subjectRepository.findOne({ where: { id } });
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    return subject;
  }

  async create(subjectData: ISubject): Promise<Subject> {
    const newSubject = this.subjectRepository.create(subjectData);
    return this.subjectRepository.save(newSubject);
  }

  async update(id: number, subjectData: Partial<ISubject>): Promise<Subject> {
    const subject = await this.findOne(id);
    Object.assign(subject, subjectData);
    return this.subjectRepository.save(subject);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.subjectRepository.delete(id);
    return result.affected > 0;
  }
}

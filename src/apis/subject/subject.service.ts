import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Subject } from './entities/subject.entity';
import { ISubject, ISubjectService, ISubjectServiceFindSubject } from './interfaces/subject.interface';

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

  async create(subjectName): Promise<Subject> {
    const newSubject = this.subjectRepository.create({ subjectName });
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

  async findOrCreateByName(subjectName: string): Promise<Subject> {
    const subject = await this.subjectRepository.findOne({ where: { subjectName } });

    if (!subject) {
      const newSubject = this.create(subjectName);
      return newSubject;
    }
    return subject;
  }

  async find({ subjectTitles }: ISubjectServiceFindSubject): Promise<Subject[]> {
    const subject = await this.subjectRepository.find({
      where: {
        subjectName: In(subjectTitles),
      },
    });
    if (!subject) throw new Error('찾는 과목이 없습니다.');
    return subject;
  }
}

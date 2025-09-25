import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectService } from './subject.service';
import { SubjectResolver } from './subject.resolver';
import { Subject } from './entities/subject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subject])],
  providers: [SubjectResolver, SubjectService],
  exports: [SubjectService],
})
export class SubjectModule {}

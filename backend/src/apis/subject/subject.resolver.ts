import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { Subject } from './entities/subject.entity';
import { CreateSubjectInput } from './dto/create-subject.input';
import { UpdateSubjectInput } from './dto/update-subject.input';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver(() => Subject)
export class SubjectResolver {
  constructor(private readonly subjectService: SubjectService) {}

  @Query(() => [Subject])
  async subjects(): Promise<Subject[]> {
    return this.subjectService.findAll();
  }

  @Query(() => Subject)
  async subject(@Args('id', { type: () => Int }) id: number): Promise<Subject> {
    return this.subjectService.findOne(id);
  }

  @Mutation(() => Subject)
  @UseGuards(GqlAuthGuard)
  async createSubject(
    @Args('createSubjectInput') createSubjectInput: CreateSubjectInput,
  ): Promise<Subject> {
    return this.subjectService.create(createSubjectInput);
  }

  @Mutation(() => Subject)
  @UseGuards(GqlAuthGuard)
  async updateSubject(
    @Args('updateSubjectInput') updateSubjectInput: UpdateSubjectInput,
  ): Promise<Subject> {
    return this.subjectService.update(
      updateSubjectInput.id,
      updateSubjectInput,
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteSubject(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.subjectService.delete(id);
  }
}

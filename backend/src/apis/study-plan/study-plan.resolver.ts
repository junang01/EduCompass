import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { StudyPlansService } from './study-plans.service';
import { StudyPlan } from './entities/study-plan.entity';
import { CreateStudyPlanInput } from './dto/create-study-plan.input';
import { UpdateStudyPlanInput } from './dto/update-study-plan.input';
import { StudyPlanArgs } from './dto/study-plan.args';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { IStudyPlan } from './interface/study-plan.interface';

@Resolver(() => StudyPlan)
export class StudyPlansResolver {
  constructor(private readonly studyPlansService: StudyPlansService) {}

  @Query(() => [StudyPlan])
  @UseGuards(GqlAuthGuard)
  async studyPlans(
    @CurrentUser() user: User,
    @Args() args: StudyPlanArgs,
  ): Promise<IStudyPlan[]> {
    return this.studyPlansService.findAll(user.id, args);
  }

  @Query(() => StudyPlan)
  @UseGuards(GqlAuthGuard)
  async studyPlan(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: User,
  ): Promise<IStudyPlan> {
    const plan = await this.studyPlansService.findOne(id);
    if (plan.userId !== user.id) {
      throw new Error('You are not authorized to access this study plan');
    }
    return plan;
  }

  @Mutation(() => StudyPlan)
  @UseGuards(GqlAuthGuard)
  async createStudyPlan(
    @Args('createStudyPlanInput') createStudyPlanInput: CreateStudyPlanInput,
    @CurrentUser() user: User,
  ): Promise<IStudyPlan> {
    const result = await this.studyPlansService.create({
      ...createStudyPlanInput,
      userId: user.id,
    });
    return result;
  }

  @Mutation(() => StudyPlan)
  @UseGuards(GqlAuthGuard)
  async updateStudyPlan(
    @Args('updateStudyPlanInput') updateStudyPlanInput: UpdateStudyPlanInput,
    @CurrentUser() user: User,
  ): Promise<IStudyPlan> {
    const plan = await this.studyPlansService.findOne(updateStudyPlanInput.id);
    if (plan.userId !== user.id) {
      throw new Error('You are not authorized to update this study plan');
    }
    
        const { id, ...updateData } = updateStudyPlanInput;
    
    return this.studyPlansService.update(id, updateData);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteStudyPlan(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    const plan = await this.studyPlansService.findOne(id);
    if (plan.userId !== user.id) {
      throw new Error('You are not authorized to delete this study plan');
    }
    return this.studyPlansService.delete(id);
  }

  @Mutation(() => StudyPlan)
  @UseGuards(GqlAuthGuard)
  async completeStudyPlan(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: User,
  ): Promise<IStudyPlan> {
    const plan = await this.studyPlansService.findOne(id);
    if (plan.userId !== user.id) {
      throw new Error('You are not authorized to complete this study plan');
    }
    return this.studyPlansService.complete(id);
  }

  @Query(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async checkDuplicate(
    @Args('date') date: Date,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.studyPlansService.checkDuplicate(date, user.id);
  }

  @Query(() => [StudyPlan])
  @UseGuards(GqlAuthGuard)
  async calendarData(
    @CurrentUser() user: User,
  ): Promise<any[]> {
    return this.studyPlansService.getCalendarData(user.id);
  }
  
  @Query(() => [StudyPlan])
  @UseGuards(GqlAuthGuard)
  async studyPlansBySubject(
    @Args('subject_seq', { type: () => Int }) subject_seq: number,
    @CurrentUser() user: User,
  ): Promise<IStudyPlan[]> {
    return this.studyPlansService.findBySubject(subject_seq, user.id);
  }
}

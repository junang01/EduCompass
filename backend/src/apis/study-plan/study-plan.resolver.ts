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
      throw new Error('이 학습 계획에 접근할 권한이 없습니다');
    }
    return plan;
  }

  @Mutation(() => StudyPlan)
  @UseGuards(GqlAuthGuard)
  async createStudyPlan(
    @Args('createStudyPlanInput') createStudyPlanInput: CreateStudyPlanInput,
    @CurrentUser() user: User,
  ): Promise<IStudyPlan> {
    const studyPlan = new StudyPlan();
    Object.assign(studyPlan, createStudyPlanInput);
    studyPlan.endDate = studyPlan.endDate || new Date(); // 기본값 설정
    studyPlan.userId = user.id;

    // 날짜가 없으면 현재 시간으로 설정
  studyPlan.date = studyPlan.date || new Date();
  studyPlan.endDate = studyPlan.endDate || new Date();
  studyPlan.userId = user.id;
    
    const result = await this.studyPlansService.create(studyPlan);
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
      throw new Error('이 학습 계획을 수정할 권한이 없습니다');
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
      throw new Error('이 학습 계획을 삭제할 권한이 없습니다');
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
      throw new Error('이 학습 계획을 완료 처리할 권한이 없습니다');
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
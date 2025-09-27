import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { StudyPlansService } from './study-plans.service';
import { StudyPlan } from './entities/study-plan.entity';
import { ExamSchedule } from './entities/exam-schedule.entity';
import { CreateStudyPlanInput } from './dto/create-study-plan.input';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { FeatureUsageService } from '../featureUsage/featureUsage.service';
import { IContext } from 'src/commons/interfaces/context';
import { UpdateStudyPlanInput } from './dto/update-study-plan.input';

@Resolver(() => StudyPlan)
export class StudyPlansResolver {
  constructor(
    private readonly studyPlansService: StudyPlansService,
    private readonly featureUsageService: FeatureUsageService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => StudyPlan)
  async createStudyPlan(
    @Args('createStudyPlanInput') createStudyPlanInput: CreateStudyPlanInput,
    @Context() context,
    @CurrentUser() user: User,
  ): Promise<StudyPlan> {
    const userId = context.req.user.id;
    createStudyPlanInput.availableStudyScheduleInput.forEach((day) => {
      console.log(`${day.day}`);
      day.timeRanges.forEach((range, idx) => {
        console.log(`   ${idx + 1}. ${range.startTime} ~ ${range.endTime}`);
      });
    });
    console.log('dto확인', createStudyPlanInput);
    const featureName = 'CreateStudyPlan';
    const studyPlan = await this.studyPlansService.createStudyPlan({ userId, createStudyPlanInput });
    return studyPlan;
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [StudyPlan])
  async findStudyPlans(@CurrentUser() user: User): Promise<StudyPlan[]> {
    return await this.studyPlansService.findAll({ user });
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => StudyPlan)
  async findStudyPlan(@Args('studyPlanId') studyPlanId: number, @CurrentUser() user: User): Promise<StudyPlan> {
    const userId = user.id;
    return await this.studyPlansService.findOne({ studyPlanId, userId });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => StudyPlan)
  async updateStudyPlan(@Args('updateStudyPlanInput') updateStudyPlanInput: UpdateStudyPlanInput, @CurrentUser() user: User): Promise<StudyPlan> {
    const userId = user.id;
    const featureName = 'UpdateStudyPlan';
    const findUsageReturn = await this.featureUsageService.canUsage({ userId, featureName });
    const studyPlan = await this.studyPlansService.updateStudyPlan({ userId, updateStudyPlanInput });
    await this.featureUsageService.saveUsage({ userId, featureName }, findUsageReturn);
    return studyPlan;
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [ExamSchedule])
  async findExamSchedules(@Args('studyPlanId') studyPlanId: number, @CurrentUser() user: User): Promise<ExamSchedule[]> {
    const userId = user.id;
    return await this.studyPlansService.findExamSchedules({ studyPlanId, userId });
  }
}

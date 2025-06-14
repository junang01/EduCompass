import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { StudyPlansService } from './study-plans.service';
import { StudyPlan } from './entities/study-plan.entity';
import { CreateStudyPlanInput } from './dto/create-study-plan.input';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { FeatureUsageService } from '../featureUsage/featureUsage.service';
import { IContext } from 'src/commons/interfaces/context';

@Resolver(() => StudyPlan)
export class StudyPlansResolver {
  constructor(
    private readonly studyPlansService: StudyPlansService,
    private readonly featureUsageService: FeatureUsageService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => StudyPlan)
  async createStudyPlan(@Args('createStudyPlanInput') createStudyPlanInput: CreateStudyPlanInput, @CurrentUser() user: User): Promise<StudyPlan> {
    const userId = user.id;
    const featureName = 'CreateStudyPlan';
    const findUsageReturn = await this.featureUsageService.canUsage({ userId, featureName });
    const studyPlan = await this.studyPlansService.createStudyPlan({ userId, createStudyPlanInput });
    await this.featureUsageService.saveUsage({ userId, featureName }, findUsageReturn);
    return studyPlan;
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [StudyPlan])
  async findStudyPlans(
    @CurrentUser() user: User,
  ):Promise<StudyPlan[]>{
    return await this.studyPlansService.findAll({user})
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => StudyPlan)
  async findStudyPlan(
    @Args('studyPlanId') studyPlanId: number,
    @CurrentUser() user:User,
  ):Promise<StudyPlan>{
    return await this.studyPlansService.findOne({studyPlanId, user})
  }

  // @UseGuards(GqlAuthGuard)
  // @Mutation()
  // async adjustStudyPlan(
  //   @Args()
  // ){}

}

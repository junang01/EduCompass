import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { StudyPlansService } from './study-plans.service';
import { StudyPlan } from './entities/study-plan.entity';
import { CreateStudyPlanInput } from './dto/create-study-plan.input';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { FeatureUsageService } from '../featureUsage/featureUsage.service';

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
    @CurrentUser() user: User,
  ): Promise<StudyPlan> {
    console.log(user.id);
    const userId = user.id;
    const featureName = 'CreateStudyPlan';

    await this.featureUsageService.canUsage({ userId, featureName });
    const studyPlan = this.studyPlansService.createStudyPlan({ userId, createStudyPlanInput });
    this.featureUsageService.saveUsage({ userId, featureName });
    return studyPlan;
  }

  //   @UseGuards(GqlAuthGuard)
  //   @Mutation(() => StudyPlan)
  //   async adjustStudyPlan(@Args('adjustStudyPlanInput') adjustStudyPlanInput: IAdjustStudyPlanInput) {}
  // }
}

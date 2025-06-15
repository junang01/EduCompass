import { Resolver, Query, Args } from '@nestjs/graphql';
import { StudyStatusService } from './study-status.service';
import { User } from '../users/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { StudyStatsOutput } from './dto/study-status.outputs';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class StudyStatusResolver {
  constructor(private readonly studyStatusService: StudyStatusService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [StudyStatsOutput])
  async getStatsBySubject(@CurrentUser() user: User) {
    return this.studyStatusService.getStatsBySubject(user);
  }
  @UseGuards(GqlAuthGuard)
  @Query(() => [StudyStatsOutput])
  async getStatsByStudyPlan(@CurrentUser() user: User) {
    return this.studyStatusService.getStatsByStudyPlan(user);
  }
  @UseGuards(GqlAuthGuard)
  @Query(() => StudyStatsOutput)
  async getStatsByDateRange(
    @CurrentUser() user: User,
    @Args('startDate', { type: () => Date }) startDate: Date,
    @Args('endDate', { type: () => Date }) endDate: Date,
  ) {
    return this.studyStatusService.getStatsByDateRange(user, startDate, endDate);
  }
}

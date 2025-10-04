import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { StudyStatusService } from './study-status.service';
import { StudyStatus } from './entities/study-status.entity';
import { CreateStudyStatusInput} from './dto/create-study-status.input';
import { UpdateStudyStatusInput } from './dto/update-study-status.input';
import { StudyStatusArgs } from './dto/study-status.args';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { OverallStatsResponse } from './dto/overall-stats.response';


@Resolver(() => StudyStatus)
export class StudyStatusResolver {
  constructor(private readonly studyStatusService: StudyStatusService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() =>[CreateStudyStatusInput])
  async getStudyStatus(
    @Args('id') id:number,
    @CurrentUser() user:User
  ):Promise<CreateStudyStatusInput[]>{
    return this.studyStatusService.getStudyStatusByPlan({id, user});
  }

  // ✅ 기간별 통계
  @UseGuards(GqlAuthGuard)
  @Query(() => OverallStatsResponse)
  async getStatsByPeriod(
    @Args('start') start: string,
    @Args('end') end: string,
    @Args('planId', { type: () => Int, nullable: true }) planId: number | null,
    @CurrentUser() user: User,
  ): Promise<OverallStatsResponse> {
    return this.studyStatusService.getStatsByPeriod({ start, end, user, planId: planId ?? undefined });
  }
}

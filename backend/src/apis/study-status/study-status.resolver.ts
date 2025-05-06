import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { StudyStatusService } from './study-status.service';
import { StudyStatus } from './entities/study-status.entity';
import { CreateStudyStatusInput } from './dto/create-study-status.input';
import { UpdateStudyStatusInput } from './dto/update-study-status.input';
import { StudyStatusArgs } from './dto/study-status.args';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { OverallStatsResponse } from './dto/overall-stats.response';

@Resolver(() => StudyStatus)
export class StudyStatusResolver {
  constructor(private readonly studyStatusService: StudyStatusService) {}

  @Query(() => [StudyStatus])
  @UseGuards(GqlAuthGuard)
  async studyStatuses(
    @CurrentUser() user: User,
    @Args() args: StudyStatusArgs,
  ): Promise<StudyStatus[]> {
    return this.studyStatusService.findAll(user.id, args);
  }

  @Query(() => StudyStatus)
  @UseGuards(GqlAuthGuard)
  async studyStatus(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: User,
  ): Promise<StudyStatus> {
    return this.studyStatusService.findOne(id, user.id);
  }

  @Mutation(() => StudyStatus)
  @UseGuards(GqlAuthGuard)
  async createStudyStatus(
    @Args('createStudyStatusInput')
    createStudyStatusInput: CreateStudyStatusInput,
    @CurrentUser() user: User,
  ): Promise<StudyStatus> {
    const result = await this.studyStatusService.create({
      ...createStudyStatusInput,
      userId: user.id,
    });
    return result;
  }

  @Mutation(() => StudyStatus)
  @UseGuards(GqlAuthGuard)
  async updateStudyStatus(
    @Args('updateStudyStatusInput')
    updateStudyStatusInput: UpdateStudyStatusInput,
    @CurrentUser() user: User,
  ): Promise<StudyStatus> {
    return this.studyStatusService.update(
      updateStudyStatusInput.id,
      updateStudyStatusInput,
      user.id,
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteStudyStatus(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.studyStatusService.delete(id, user.id);
  }

  @Query(() => StudyStatus)
  @UseGuards(GqlAuthGuard)
  async subjectStats(
    @Args('subject') subject: string,
    @CurrentUser() user: User,
  ): Promise<StudyStatus> {
    return this.studyStatusService.getSubjectStats(
      user.id,
      subject,
    ) as unknown as StudyStatus;
  }

  @Query(() => OverallStatsResponse)
  @UseGuards(GqlAuthGuard)
  async overallStats(@CurrentUser() user: User): Promise<OverallStatsResponse> {
    return this.studyStatusService.getOverallStats(user.id);
  }
}

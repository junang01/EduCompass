import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { Notification } from './entities/notice.entity';
import { CreateNoticeInput } from './dto/create-notice.input';
import { UpdateNoticeInput } from './dto/update-notice.input';
import { NoticeArgs } from './dto/notice.args';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { SendEmailInput } from './dto/send-email.input';
import { NoticeResponse } from './dto/notice-response';

@Resolver(() => Notification)
export class NoticeResolver {
  constructor(private readonly noticeService: NoticeService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [Notification])
  async notices(
    @CurrentUser() user: User, //
    @Args() args: NoticeArgs,
  ): Promise<Notification[]> {
    return this.noticeService.findAll(user.id, args);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Notification)
  async notice(
    @Args('id', { type: () => Int }) id: number, //
    @CurrentUser() user: User,
  ): Promise<Notification> {
    return this.noticeService.findOne(id, user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Notification)
  async createNotice(@Args('createNoticeInput') createNoticeInput: CreateNoticeInput, @CurrentUser() user: User): Promise<Notification> {
    return this.noticeService.create({
      ...createNoticeInput,
      userId: user.id,
    });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Notification)
  async updateNotice(@Args('updateNoticeInput') updateNoticeInput: UpdateNoticeInput, @CurrentUser() user: User): Promise<Notification> {
    return this.noticeService.update(updateNoticeInput.id, updateNoticeInput, user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async deleteNotice(
    @Args('id', { type: () => Int }) id: number, //
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.noticeService.delete(id, user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Notification)
  async sendNotice(@Args('createNoticeInput') createNoticeInput: CreateNoticeInput, @CurrentUser() user: User): Promise<Notification> {
    return this.noticeService.create({
      ...createNoticeInput,
      userId: user.id,
    });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => NoticeResponse)
  async sendEmailToParent(@Args('data') data: SendEmailInput, @CurrentUser() user: User): Promise<any> {
    const emailData = {
      parentEmail: data.parentEmail,
      reportContent: data.reportContent,
      userId: user.id,
    };

    return this.noticeService.sendEmailToParent(emailData);
  }
}

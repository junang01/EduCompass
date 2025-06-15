import { Args, Int, Mutation, Resolver } from "@nestjs/graphql";
import { StudySchedule } from "./entities/studySchedule.entity";
import { StudyScheduleService } from "./studyschedule.service";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { UseGuards } from "@nestjs/common";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { User } from "../users/entities/user.entity";
import { CreateStudyScheduleInput, UpdateScheduleInput } from "./dto/createStudySchedule.input";

@Resolver(() => StudySchedule)
export class StudyScheduleResolver{
    constructor(
        private readonly studyScheduleService:StudyScheduleService
    ){}

    @UseGuards(GqlAuthGuard)
    @Mutation(() =>StudySchedule)
    async createSchedule(
        @Args('createStudyScheduleInput') createStudyScheduleInput:CreateStudyScheduleInput,
        @CurrentUser() user:User
    ):Promise<StudySchedule>{
    return await this.studyScheduleService.create({  createStudyScheduleInput , user })
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() =>StudySchedule)
    async updateSchedule(
        @Args('updateScheduleInput') updateScheduleInput:UpdateScheduleInput,
        @CurrentUser() user:User,
    ):Promise<StudySchedule>{
        return await this.studyScheduleService.update({updateScheduleInput, user})
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => StudySchedule)
    async updateCompleted(
        @Args('id',{ type: () => Int }) id:number,
        @CurrentUser() user:User,
    ):Promise<StudySchedule>{
        return await this.studyScheduleService.completeUpdate({id,user})
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => [StudySchedule])
    async findScheduleDateRange(
        @Args('startTime') startTime:string,
        @Args('endTime') endTime:string,
        @CurrentUser() user:User
    ):Promise<StudySchedule[]>{
        return await this.studyScheduleService.findByDateRange({startTime, endTime, user})
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Boolean)
    async deleteSchedule(
        @Args('id', { type: () => Int }) id:number,
        @CurrentUser() user:User
    ):Promise<boolean>{
        return await this.studyScheduleService.delete({id,user})
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => StudySchedule)
    async delaySchedule(
        @Args('updateScheduleInput') updateScheduleInput:UpdateScheduleInput,
        @CurrentUser() user:User
    ):Promise<StudySchedule>{
        return await this.studyScheduleService.delay({updateScheduleInput, user})
    }
}
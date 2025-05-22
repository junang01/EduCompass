import { Module } from "@nestjs/common";
import { StudySchedule } from "./entities/studySchedule.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StudyScheduleResolver } from "./studySchedule.resolver";
import { StudyScheduleService } from "./studyschedule.service";

@Module({
    imports:[TypeOrmModule.forFeature([StudySchedule])],

    providers:[StudyScheduleResolver, StudyScheduleService],

    exports:[]
})
export class StudyScheduleModule{}
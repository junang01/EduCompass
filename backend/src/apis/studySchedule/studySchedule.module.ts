import { Module } from "@nestjs/common";
import { StudySchedule } from "./entities/studySchedule.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StudyScheduleResolver } from "./studySchedule.resolver";
import { StudyScheduleService } from "./studyschedule.service";

@Module({
    imports:[TypeOrmModule.forFeature([StudySchedule])],

    providers:[StudyScheduleResolver, StudyScheduleService],

    exports:[ TypeOrmModule.forFeature([StudySchedule]), // <-- 이 부분을 추가해야 합니다!
    StudyScheduleService ]
})
export class StudyScheduleModule{}
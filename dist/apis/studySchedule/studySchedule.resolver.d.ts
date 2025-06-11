import { StudySchedule } from "./entities/studySchedule.entity";
import { StudyScheduleService } from "./studyschedule.service";
import { User } from "../users/entities/user.entity";
import { CreateStudyScheduleInput, UpdateScheduleInput } from "./dto/createStudySchedule.input";
export declare class StudyScheduleResolver {
    private readonly studyScheduleService;
    constructor(studyScheduleService: StudyScheduleService);
    createSchedule(createStudyScheduleInput: CreateStudyScheduleInput, user: User): Promise<StudySchedule>;
    updateSchedule(updateScheduleInput: UpdateScheduleInput, user: User): Promise<StudySchedule>;
    updateCompleted(id: number, user: User): Promise<StudySchedule>;
    findScheduleDateRange(startTime: string, endTime: string, user: User): Promise<StudySchedule[]>;
    deleteSchedule(id: number, user: User): Promise<boolean>;
    delaySchedule(updateScheduleInput: UpdateScheduleInput, user: User): Promise<StudySchedule>;
}

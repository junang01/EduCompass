import { User } from "src/apis/users/entities/user.entity";
import { CreateStudyScheduleInput, UpdateScheduleInput } from "../dto/createStudySchedule.input";
export interface IStudyScheduleServiceCreate {
    createStudyScheduleInput: CreateStudyScheduleInput;
    user: User;
}
export interface IStudyScheduleServiceUpdate {
    updateScheduleInput: UpdateScheduleInput;
    user: User;
}
export interface IStudyScheduleServiceFindOne {
    id: number;
    user: User;
}
export interface IStudyScheduleServiceFindByDateRange {
    startTime: string;
    endTime: string;
    user: User;
}

import { StudySchedule } from "./entities/studySchedule.entity";
import { Repository } from "typeorm";
import { IStudyScheduleServiceCreate, IStudyScheduleServiceFindByDateRange, IStudyScheduleServiceFindOne, IStudyScheduleServiceUpdate } from "./interfaces/studySchedule.interface";
export declare class StudyScheduleService {
    private readonly studyScheduleRepository;
    constructor(studyScheduleRepository: Repository<StudySchedule>);
    create({ createStudyScheduleInput, user }: IStudyScheduleServiceCreate): Promise<StudySchedule>;
    delay({ updateScheduleInput, user }: IStudyScheduleServiceUpdate): Promise<StudySchedule>;
    update({ updateScheduleInput, user }: IStudyScheduleServiceUpdate): Promise<StudySchedule>;
    completeUpdate({ id, user }: IStudyScheduleServiceFindOne): Promise<StudySchedule>;
    findOne({ id, user }: IStudyScheduleServiceFindOne): Promise<StudySchedule>;
    findByDateRange({ startTime, endTime, user }: IStudyScheduleServiceFindByDateRange): Promise<StudySchedule[]>;
    delete({ id, user }: IStudyScheduleServiceFindOne): Promise<boolean>;
}

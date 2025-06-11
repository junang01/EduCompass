export declare class CreateStudyScheduleInput {
    startTime: string;
    endTime: string;
    content: string;
}
export declare class UpdateScheduleInput {
    id: number;
    content?: string;
    startTime?: Date;
    endTime?: Date;
}

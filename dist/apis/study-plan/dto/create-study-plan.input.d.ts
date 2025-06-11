export declare class CreateStudyPlanInput {
    title: string;
    studyPeriod: string;
    availableStudyScheduleInput: AvailableStudyScheduleInput[];
    learningStyle: string;
    reviewDays: string[];
    missedPlanDays: string[];
    subjects: SubjectInput[];
}
export declare class SubjectInput {
    subject: string;
    studyBookInput: StudyBookInput[];
    examContentInput: ExamContentInput[];
    studyLevel: string;
}
export declare class AvailableStudyScheduleInput {
    day: string;
    timeRanges: TimeRangeInput[];
}
export declare class ExamContentInput {
    examcontent: string;
    examStartDay: string;
    examLastScore: string;
    examGoalScore: string;
}
export declare class StudyBookInput {
    bookName: string;
    bookIndex: string;
    bookReview: string;
}
export declare class TimeRangeInput {
    startTime: string;
    endTime: string;
}

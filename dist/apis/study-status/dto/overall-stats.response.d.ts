export declare class SubjectStat {
    subject: string;
    completionRate: number;
    postponeRate: number;
    incompleteRate: number;
}
export declare class OverallStatsResponse {
    completionRate: number;
    postponeRate: number;
    incompleteRate: number;
    subjectStats: SubjectStat[];
}

import { CreateStudyStatusInput } from './create-study-status.input';
declare const UpdateStudyStatusInput_base: import("@nestjs/common").Type<Partial<CreateStudyStatusInput>>;
export declare class UpdateStudyStatusInput extends UpdateStudyStatusInput_base {
    id: number;
    completionRate?: number;
    postponeRate?: number;
    incompleteRate?: number;
}
export {};

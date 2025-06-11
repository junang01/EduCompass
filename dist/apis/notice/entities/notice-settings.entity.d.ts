import { User } from '../../users/entities/user.entity';
export declare class NoticeSettings {
    id: number;
    userId: number;
    user: User;
    reportFrequency: string;
    parentEmail: string;
    isEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
}

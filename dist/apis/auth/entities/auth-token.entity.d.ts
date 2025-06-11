import { User } from '../../users/entities/user.entity';
export declare class AuthToken {
    id: number;
    token: string;
    issueDate: Date;
    expiresDate: Date;
    isUsed: boolean;
    user: User;
}

import { User } from '../../users/entities/user.entity';
export declare class Notification {
    id: number;
    message: string;
    receiverEmail: string;
    userId: number;
    user: User;
    createdAt: Date;
}

import { User } from '../../users/entities/user.entity';
export declare class AuthPayload {
    accessToken: string;
    refreshToken: string;
    user: User;
}

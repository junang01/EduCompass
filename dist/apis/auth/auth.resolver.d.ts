import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
export declare class AuthStatus {
    isAuthenticated: boolean;
    message: string;
    tokenStatus: string;
    expiresIn?: number;
}
export declare class AuthResolver {
    private readonly authService;
    private readonly jwtService;
    private readonly logger;
    constructor(authService: AuthService, jwtService: JwtService);
    getDeletedUsers(): Promise<User[]>;
    tokenInfo(token: string): Promise<{
        subject: any;
        issuedAt: Date;
        expiresAt: Date;
        isExpired: boolean;
        isBlacklisted: boolean;
    }>;
    isTokenExpired(context: any): Promise<boolean>;
    checkAuthStatus(context: any): Promise<{
        isAuthenticated: boolean;
        message: string;
        tokenStatus: string;
        expiresIn?: undefined;
    } | {
        isAuthenticated: boolean;
        message: string;
        tokenStatus: string;
        expiresIn: number;
    }>;
    login(input: LoginInput): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: number;
            email: string;
            name: string;
        };
    }>;
    logout(context: any): Promise<boolean>;
    sendAuthEmail(email: string): Promise<string>;
    checkToken(inputToken: string, email: string): Promise<string>;
    adminLogin(input: LoginInput): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: number;
            email: string;
            name: string;
        };
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: number;
            email: string;
            name: string;
        };
    }>;
}

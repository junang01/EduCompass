import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { EmailVaildation } from './entities/email-validation.entity';
import { TokenBlacklist } from './entities/token-blacklist.entity';
import { IAuthCheckToken, IAuthGetToken, IAuthSendTemplateToEmail } from './interfaces/auth-getToken.interface';
import { SentMessageInfo } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
export type SanitizedUser = Omit<User, 'password'>;
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly configService;
    private readonly emailValidationRepository;
    private readonly tokenBlacklistRepository;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService, emailValidationRepository: Repository<EmailVaildation>, tokenBlacklistRepository: Repository<TokenBlacklist>);
    validateUser(email: string, password: string): Promise<SanitizedUser | null>;
    login(user: SanitizedUser): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: number;
            email: string;
            name: string;
        };
    }>;
    logout(accessToken: string, refreshToken: string): Promise<boolean>;
    getToken(): Promise<IAuthGetToken>;
    makeTemplate(token: string): string;
    sendAuthTokenEmail(email: string): Promise<string>;
    private checkEmailAvailability;
    sendTemplateToEmail({ email, template }: IAuthSendTemplateToEmail): Promise<SentMessageInfo>;
    checkToken({ email, inputToken }: IAuthCheckToken): Promise<string>;
    cleanupExpiredTokens(): Promise<void>;
    refreshAccessToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: number;
            email: string;
            name: string;
        };
    }>;
    blacklistRefreshToken(token: string): Promise<void>;
    isTokenBlacklisted(token: string): Promise<boolean>;
    cleanupBlacklistedTokens(): Promise<void>;
    handleTokenCleanup(): Promise<void>;
    validateAdminUser(email: string, password: string): Promise<SanitizedUser | null>;
    getDeletedUsers(): Promise<User[]>;
}

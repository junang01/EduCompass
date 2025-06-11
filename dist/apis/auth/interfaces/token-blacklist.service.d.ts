import { JwtService } from '@nestjs/jwt';
export declare class TokenBlacklistService {
    private readonly jwtService;
    private readonly blacklistedTokens;
    constructor(jwtService: JwtService);
    blacklistToken(token: string): void;
    isBlacklisted(token: string): boolean;
    private removeExpiredTokens;
}

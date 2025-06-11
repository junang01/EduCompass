"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthResolver_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthResolver = exports.AuthStatus = void 0;
const graphql_1 = require("@nestjs/graphql");
const auth_service_1 = require("./auth.service");
const login_input_1 = require("./dto/login.input");
const auth_payload_1 = require("./entities/auth.payload");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const token_info_entity_1 = require("./entities/token-info.entity");
const jwt_1 = require("@nestjs/jwt");
const user_entity_1 = require("../users/entities/user.entity");
const admin_guard_1 = require("./guards/admin.guard");
let AuthStatus = class AuthStatus {
};
exports.AuthStatus = AuthStatus;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], AuthStatus.prototype, "isAuthenticated", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], AuthStatus.prototype, "message", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], AuthStatus.prototype, "tokenStatus", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], AuthStatus.prototype, "expiresIn", void 0);
exports.AuthStatus = AuthStatus = __decorate([
    (0, graphql_1.ObjectType)()
], AuthStatus);
let AuthResolver = AuthResolver_1 = class AuthResolver {
    constructor(authService, jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(AuthResolver_1.name);
    }
    async getDeletedUsers() {
        try {
            return await this.authService.getDeletedUsers();
        }
        catch (error) {
            this.logger.error('회원탈퇴 사용자 조회 중 오류:', error);
            throw new common_1.ForbiddenException('회원탈퇴 사용자 조회에 실패했습니다');
        }
    }
    async tokenInfo(token) {
        const decoded = this.jwtService.decode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        return {
            subject: decoded.sub,
            issuedAt: new Date(decoded.iat * 1000),
            expiresAt: new Date(decoded.exp * 1000),
            isExpired: decoded.exp < currentTime,
            isBlacklisted: await this.authService.isTokenBlacklisted(token),
        };
    }
    async isTokenExpired(context) {
        const authHeader = context.req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return true;
        }
        const token = authHeader.substring(7);
        try {
            const decoded = this.jwtService.decode(token);
            if (!decoded || !decoded.exp) {
                return true;
            }
            const currentTime = Math.floor(Date.now() / 1000);
            return decoded.exp < currentTime;
        }
        catch (error) {
            return true;
        }
    }
    async checkAuthStatus(context) {
        const authHeader = context.req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return {
                isAuthenticated: false,
                message: '인증 토큰이 없습니다',
                tokenStatus: 'MISSING',
            };
        }
        const token = authHeader.substring(7);
        try {
            const decoded = this.jwtService.verify(token);
            const isBlacklisted = await this.authService.isTokenBlacklisted(token);
            if (isBlacklisted) {
                return {
                    isAuthenticated: false,
                    message: '로그아웃된 토큰입니다',
                    tokenStatus: 'BLACKLISTED',
                };
            }
            const currentTime = Math.floor(Date.now() / 1000);
            const timeToExpire = decoded.exp - currentTime;
            if (timeToExpire < 300 && timeToExpire > 0) {
                return {
                    isAuthenticated: true,
                    message: '토큰이 곧 만료됩니다',
                    tokenStatus: 'EXPIRING_SOON',
                    expiresIn: timeToExpire,
                };
            }
            return {
                isAuthenticated: true,
                message: '인증 상태가 유효합니다',
                tokenStatus: 'VALID',
                expiresIn: timeToExpire,
            };
        }
        catch (error) {
            if (error.name === 'TokenExpiredError') {
                return {
                    isAuthenticated: false,
                    message: '인증 토큰이 만료되었습니다',
                    tokenStatus: 'EXPIRED',
                };
            }
            return {
                isAuthenticated: false,
                message: '유효하지 않은 토큰입니다',
                tokenStatus: 'INVALID',
            };
        }
    }
    async login(input) {
        const user = await this.authService.validateUser(input.email, input.password);
        if (!user) {
            throw new common_1.UnauthorizedException('유효하지 않은 인증 정보입니다');
        }
        return this.authService.login(user);
    }
    async logout(context) {
        try {
            const authHeader = context.req.headers.authorization;
            let accessToken;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                accessToken = authHeader.substring(7);
            }
            let refreshToken;
            if (context.req.cookies && context.req.cookies.refreshToken) {
                refreshToken = context.req.cookies.refreshToken;
            }
            else if (context.req.headers['x-refresh-token']) {
                refreshToken = context.req.headers['x-refresh-token'];
            }
            await this.authService.logout(accessToken, refreshToken);
            this.logger.debug('액세스/리프레시 토큰이 블랙리스트에 추가되었습니다');
            return true;
        }
        catch (error) {
            this.logger.error('로그아웃 처리 중 오류:', error);
            return false;
        }
    }
    async sendAuthEmail(email) {
        return this.authService.sendAuthTokenEmail(email);
    }
    async checkToken(inputToken, email) {
        return this.authService.checkToken({ inputToken, email });
    }
    async adminLogin(input) {
        const user = await this.authService.validateAdminUser(input.email, input.password);
        if (!user) {
            throw new common_1.UnauthorizedException('관리자 인증에 실패했습니다');
        }
        return this.authService.login(user);
    }
    async refreshToken(refreshToken) {
        try {
            return this.authService.refreshAccessToken(refreshToken);
        }
        catch (error) {
            this.logger.error('토큰 갱신 실패:', error);
            throw new common_1.UnauthorizedException('토큰 갱신에 실패했습니다');
        }
    }
};
exports.AuthResolver = AuthResolver;
__decorate([
    (0, graphql_1.Query)(() => [user_entity_1.User]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "getDeletedUsers", null);
__decorate([
    (0, graphql_1.Query)(() => token_info_entity_1.TokenInfo),
    __param(0, (0, graphql_1.Args)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "tokenInfo", null);
__decorate([
    (0, graphql_1.Query)(() => Boolean),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "isTokenExpired", null);
__decorate([
    (0, graphql_1.Query)(() => AuthStatus),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "checkAuthStatus", null);
__decorate([
    (0, graphql_1.Mutation)(() => auth_payload_1.AuthPayload),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_input_1.LoginInput]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "logout", null);
__decorate([
    (0, graphql_1.Mutation)(() => String),
    __param(0, (0, graphql_1.Args)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "sendAuthEmail", null);
__decorate([
    (0, graphql_1.Mutation)(() => String),
    __param(0, (0, graphql_1.Args)('inputToken')),
    __param(1, (0, graphql_1.Args)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "checkToken", null);
__decorate([
    (0, graphql_1.Mutation)(() => auth_payload_1.AuthPayload),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_input_1.LoginInput]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "adminLogin", null);
__decorate([
    (0, graphql_1.Mutation)(() => auth_payload_1.AuthPayload),
    __param(0, (0, graphql_1.Args)('refreshToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "refreshToken", null);
exports.AuthResolver = AuthResolver = AuthResolver_1 = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        jwt_1.JwtService])
], AuthResolver);
//# sourceMappingURL=auth.resolver.js.map
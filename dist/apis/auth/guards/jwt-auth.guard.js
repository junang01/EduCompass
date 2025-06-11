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
var JwtAuthGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const graphql_1 = require("@nestjs/graphql");
const auth_service_1 = require("../auth.service");
let JwtAuthGuard = JwtAuthGuard_1 = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    constructor(authService) {
        super();
        this.authService = authService;
        this.logger = new common_1.Logger(JwtAuthGuard_1.name);
    }
    getRequest(context) {
        if (context.getType() === 'http') {
            return context.switchToHttp().getRequest();
        }
        else {
            const ctx = graphql_1.GqlExecutionContext.create(context);
            return ctx.getContext().req;
        }
    }
    async canActivate(context) {
        const can = await super.canActivate(context);
        if (!can)
            return false;
        const req = this.getRequest(context);
        const token = this.extractTokenFromHeader(req);
        if (!token)
            throw new common_1.UnauthorizedException('토큰이 없습니다');
        if (this.authService) {
            const isBlacklisted = await this.authService.isTokenBlacklisted(token);
            this.logger.debug(`블랙리스트 여부: ${isBlacklisted}`);
            if (isBlacklisted) {
                this.logger.warn('블랙리스트 토큰 접근 시도!');
                throw new common_1.UnauthorizedException('이미 로그아웃된 토큰입니다');
            }
        }
        return true;
    }
    handleRequest(err, user, info) {
        this.logger.debug(`handleRequest - user: ${JSON.stringify(user)}, err: ${err}`);
        if (err || !user) {
            this.logger.error(`인증 실패: ${err?.message || '사용자 정보 없음'}`);
            throw err || new common_1.UnauthorizedException('인증에 실패했습니다');
        }
        return user;
    }
    extractTokenFromHeader(request) {
        if (!request || !request.headers) {
            this.logger.error('요청 객체 또는 헤더가 없습니다');
            return undefined;
        }
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return undefined;
        }
        return authHeader.substring(7);
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = JwtAuthGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map
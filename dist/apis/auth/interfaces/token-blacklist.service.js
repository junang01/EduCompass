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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenBlacklistService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let TokenBlacklistService = class TokenBlacklistService {
    constructor(jwtService) {
        this.jwtService = jwtService;
        this.blacklistedTokens = new Map();
        setInterval(() => this.removeExpiredTokens(), 5 * 60 * 1000);
    }
    blacklistToken(token) {
        try {
            const decoded = this.jwtService.decode(token);
            if (decoded && decoded['exp']) {
                this.blacklistedTokens.set(token, decoded['exp']);
                console.log('토큰이 블랙리스트에 추가되었습니다.');
            }
        }
        catch (error) {
            console.error('토큰 블랙리스트 추가 중 오류:', error);
        }
    }
    isBlacklisted(token) {
        return this.blacklistedTokens.has(token);
    }
    removeExpiredTokens() {
        const now = Math.floor(Date.now() / 1000);
        for (const [token, expiry] of this.blacklistedTokens.entries()) {
            if (expiry < now) {
                this.blacklistedTokens.delete(token);
            }
        }
        console.log(`만료된 토큰 정리 완료. 현재 블랙리스트 크기: ${this.blacklistedTokens.size}`);
    }
};
exports.TokenBlacklistService = TokenBlacklistService;
exports.TokenBlacklistService = TokenBlacklistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], TokenBlacklistService);
//# sourceMappingURL=token-blacklist.service.js.map
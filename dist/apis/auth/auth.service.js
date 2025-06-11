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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const email_validation_entity_1 = require("./entities/email-validation.entity");
const token_blacklist_entity_1 = require("./entities/token-blacklist.entity");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const schedule_1 = require("@nestjs/schedule");
const config_1 = require("@nestjs/config");
const crypto = require("crypto");
let AuthService = class AuthService {
    constructor(usersService, jwtService, configService, emailValidationRepository, tokenBlacklistRepository) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.emailValidationRepository = emailValidationRepository;
        this.tokenBlacklistRepository = tokenBlacklistRepository;
    }
    async validateUser(email, password) {
        try {
            const user = await this.usersService.findByEmail(email);
            if (user && (await bcrypt.compare(password, user.password))) {
                const { password: _, ...result } = user;
                return result;
            }
            return null;
        }
        catch (error) {
            return null;
        }
    }
    async login(user) {
        const payload = { email: user.email, sub: user.id };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: '1h',
        });
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: '7d',
            secret: this.configService.get('JWT_REFRESH_SECRET'),
        });
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
    }
    async logout(accessToken, refreshToken) {
        try {
            if (accessToken) {
                await this.blacklistRefreshToken(accessToken);
            }
            if (refreshToken) {
                await this.blacklistRefreshToken(refreshToken);
            }
            return true;
        }
        catch (error) {
            console.error('로그아웃 처리 중 오류 발생:', error);
            return false;
        }
    }
    async getToken() {
        const isTokenUnique = async (token) => {
            const existingToken = await this.emailValidationRepository.findOne({
                where: { token },
            });
            return !existingToken;
        };
        let token;
        let isUnique = false;
        while (!isUnique) {
            const randomNum = crypto.randomInt(0, 1000000);
            token = String(randomNum).padStart(6, '0');
            isUnique = await isTokenUnique(token);
        }
        const expiry = Date.now() + 3 * 60 * 1000;
        return { token, expiry };
    }
    makeTemplate(token) {
        return `
        <html>
            <body>
            <div style ="display:flex; flex-direction: column; align-items: center;">
              <div style ="width: 500px;">
                <h1> Edu Compass입니다.</h1>
                <div style =" margin-top: 30px;"><span>회원님의 인증번호는</span> <h2 style = "color:red;">${token}</h2></div>
                <hr/>
                <h4>인증번호를 확인하시고 회원가입을 마무리하세욤</h4>
              </div>
            </div>
            </body>
        </html>
        `;
    }
    async sendAuthTokenEmail(email) {
        await this.checkEmailAvailability(email);
        const { token, expiry } = await this.getToken();
        await this.emailValidationRepository.save({
            email,
            token,
            expiry,
        });
        const template = this.makeTemplate(token);
        await this.sendTemplateToEmail({ email, template });
        return '이메일 발송이 완료되었습니다.';
    }
    async checkEmailAvailability(email) {
        const user = await this.usersService.findByEmail(email);
        if (user) {
            throw new common_1.ConflictException('이미 존재하는 이메일입니다');
        }
    }
    async sendTemplateToEmail({ email, template }) {
        const EMAIL_SENDER = process.env.EMAIL_SENDER;
        const EMAIL_PASS = process.env.EMAIL_PASS;
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL_SENDER,
                pass: EMAIL_PASS,
            },
        });
        const mailOptions = {
            from: EMAIL_SENDER,
            to: email,
            subject: 'Edu Compass 이메일 인증',
            html: template,
        };
        try {
            const emailRes = await transporter.sendMail(mailOptions);
            return emailRes;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('이메일 전송에 실패했습니다');
        }
    }
    async checkToken({ email, inputToken }) {
        const result = await this.emailValidationRepository.findOne({
            where: { email },
        });
        if (!result) {
            return '인증 정보를 찾을 수 없습니다.';
        }
        const currentTime = Date.now();
        console.log('입력된 토큰:', inputToken);
        console.log('저장된 토큰:', result.token);
        console.log('현재 시간:', currentTime);
        console.log('만료 시간:', result.expiry);
        console.log('만료 시간(변환):', BigInt(result.expiry).toString());
        const expiryTime = Number(BigInt(result.expiry).toString());
        if (result.token === inputToken && expiryTime > currentTime) {
            return '인증이 완료되었습니다.';
        }
        else {
            if (result.token !== inputToken) {
                console.log('토큰 불일치');
            }
            if (expiryTime <= currentTime) {
                console.log('토큰 만료됨');
            }
            return '인증에 실패했습니다.';
        }
    }
    async cleanupExpiredTokens() {
        const currentTime = Date.now();
        try {
            await this.emailValidationRepository.delete({
                expiry: (0, typeorm_2.LessThan)(currentTime),
            });
            console.log('만료된 인증 토큰이 성공적으로 정리되었습니다.');
        }
        catch (error) {
            console.error('토큰 정리 중 오류 발생:', error);
            throw new common_1.InternalServerErrorException('토큰 정리에 실패했습니다');
        }
    }
    async refreshAccessToken(refreshToken) {
        try {
            const isBlacklisted = await this.isTokenBlacklisted(refreshToken);
            if (isBlacklisted) {
                throw new common_1.UnauthorizedException('이미 사용된 리프레시 토큰입니다');
            }
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
            const user = await this.usersService.findOne(payload.sub);
            if (!user) {
                throw new common_1.UnauthorizedException('사용자를 찾을 수 없습니다');
            }
            await this.blacklistRefreshToken(refreshToken);
            const newPayload = { email: user.email, sub: user.id };
            const accessToken = this.jwtService.sign(newPayload, {
                expiresIn: '15m',
            });
            const newRefreshToken = this.jwtService.sign(newPayload, {
                expiresIn: '7d',
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
            return {
                accessToken,
                refreshToken: newRefreshToken,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
            };
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.UnauthorizedException('유효하지 않은 리프레시 토큰입니다');
        }
    }
    async blacklistRefreshToken(token) {
        const decoded = this.jwtService.decode(token);
        const expiryDate = new Date(decoded.exp * 1000);
        await this.tokenBlacklistRepository.save({
            token,
            expiryDate,
        });
    }
    async isTokenBlacklisted(token) {
        const blacklistedToken = await this.tokenBlacklistRepository.findOne({
            where: { token },
        });
        return !!blacklistedToken;
    }
    async cleanupBlacklistedTokens() {
        const now = new Date();
        try {
            await this.tokenBlacklistRepository.delete({
                expiryDate: (0, typeorm_2.LessThan)(now),
            });
            console.log('만료된 블랙리스트 토큰이 성공적으로 정리되었습니다.');
        }
        catch (error) {
            console.error('블랙리스트 토큰 정리 중 오류 발생:', error);
        }
    }
    async handleTokenCleanup() {
        await this.cleanupExpiredTokens();
    }
    async validateAdminUser(email, password) {
        try {
            const user = await this.usersService.findByEmail(email);
            if (user && (await bcrypt.compare(password, user.password)) && user.role === 'ADMIN') {
                const { password: _, ...result } = user;
                return result;
            }
            return null;
        }
        catch (error) {
            return null;
        }
    }
    async getDeletedUsers() {
        try {
            return await this.usersService.findDeletedUsers();
        }
        catch (error) {
            console.error('회원탈퇴 사용자 조회 중 오류 발생:', error);
            throw new common_1.InternalServerErrorException('회원탈퇴 사용자 조회에 실패했습니다');
        }
    }
};
exports.AuthService = AuthService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "cleanupBlacklistedTokens", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "handleTokenCleanup", null);
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, typeorm_1.InjectRepository)(email_validation_entity_1.EmailVaildation)),
    __param(4, (0, typeorm_1.InjectRepository)(token_blacklist_entity_1.TokenBlacklist)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map
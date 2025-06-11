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
exports.NoticeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notice_entity_1 = require("./entities/notice.entity");
const nodemailer = require("nodemailer");
let NoticeService = class NoticeService {
    constructor(noticeRepository) {
        this.noticeRepository = noticeRepository;
    }
    async findAll(userId, args) {
        const query = this.noticeRepository.createQueryBuilder('notice')
            .where('notice.userId = :userId', { userId });
        if (args?.receiverEmail) {
            query.andWhere('notice.receiverEmail = :receiverEmail', { receiverEmail: args.receiverEmail });
        }
        return query.getMany();
    }
    async findOne(id, userId) {
        const notice = await this.noticeRepository.findOne({ where: { id } });
        if (!notice) {
            throw new common_1.NotFoundException(`Notice with ID ${id} not found`);
        }
        if (notice.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to access this notice');
        }
        return notice;
    }
    async create(notice) {
        const newNotice = this.noticeRepository.create(notice);
        await this.sendEmailToParent({
            parentEmail: notice.receiverEmail,
            reportContent: notice.message,
            userId: notice.userId
        });
        return this.noticeRepository.save(newNotice);
    }
    async update(id, noticeData, userId) {
        const notice = await this.findOne(id, userId);
        Object.assign(notice, noticeData);
        return this.noticeRepository.save(notice);
    }
    async delete(id, userId) {
        await this.findOne(id, userId);
        const result = await this.noticeRepository.delete(id);
        return result.affected > 0;
    }
    async sendEmailToParent(data) {
        try {
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_USER || 'sksmsdiqkrtjsdn@gmail.com',
                    pass: process.env.EMAIL_PASS || 'gtjm ptgu sada jdcd',
                },
            });
            await transporter.verify();
            console.log('SMTP 서버 연결 성공');
            const mailOptions = {
                from: process.env.EMAIL_USER || 'sksmsdiqkrtjsdn@gmail.com',
                to: data.parentEmail,
                subject: '학습 현황 보고',
                text: data.reportContent,
            };
            const info = await transporter.sendMail(mailOptions);
            console.log('이메일 전송 성공:', info.messageId);
            return { message: '이메일 전송 성공', info };
        }
        catch (error) {
            console.error('이메일 전송 실패:', error);
            if (error.code === 'EAUTH') {
                throw new Error('이메일 인증 실패: 사용자 이름과 비밀번호를 확인하세요');
            }
            else if (error.code === 'ESOCKET') {
                throw new Error('SMTP 서버 연결 실패: 호스트 및 포트 설정을 확인하세요');
            }
            throw new Error(`이메일 전송 실패: ${error.message}`);
        }
    }
};
exports.NoticeService = NoticeService;
exports.NoticeService = NoticeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notice_entity_1.Notification)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NoticeService);
//# sourceMappingURL=notice.service.js.map
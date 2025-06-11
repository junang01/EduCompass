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
exports.NoticeResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const notice_service_1 = require("./notice.service");
const notice_entity_1 = require("./entities/notice.entity");
const create_notice_input_1 = require("./dto/create-notice.input");
const update_notice_input_1 = require("./dto/update-notice.input");
const notice_args_1 = require("./dto/notice.args");
const gql_auth_guard_1 = require("../auth/guards/gql-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const send_email_input_1 = require("./dto/send-email.input");
const notice_response_1 = require("./dto/notice-response");
let NoticeResolver = class NoticeResolver {
    constructor(noticeService) {
        this.noticeService = noticeService;
    }
    async notices(user, args) {
        return this.noticeService.findAll(user.id, args);
    }
    async notice(id, user) {
        return this.noticeService.findOne(id, user.id);
    }
    async createNotice(createNoticeInput, user) {
        return this.noticeService.create({
            ...createNoticeInput,
            userId: user.id,
        });
    }
    async updateNotice(updateNoticeInput, user) {
        return this.noticeService.update(updateNoticeInput.id, updateNoticeInput, user.id);
    }
    async deleteNotice(id, user) {
        return this.noticeService.delete(id, user.id);
    }
    async sendNotice(createNoticeInput, user) {
        return this.noticeService.create({
            ...createNoticeInput,
            userId: user.id,
        });
    }
    async sendEmailToParent(data, user) {
        const emailData = {
            parentEmail: data.parentEmail,
            reportContent: data.reportContent,
            userId: user.id,
        };
        return this.noticeService.sendEmailToParent(emailData);
    }
};
exports.NoticeResolver = NoticeResolver;
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => [notice_entity_1.Notification]),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        notice_args_1.NoticeArgs]),
    __metadata("design:returntype", Promise)
], NoticeResolver.prototype, "notices", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => notice_entity_1.Notification),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], NoticeResolver.prototype, "notice", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => notice_entity_1.Notification),
    __param(0, (0, graphql_1.Args)('createNoticeInput')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_notice_input_1.CreateNoticeInput, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], NoticeResolver.prototype, "createNotice", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => notice_entity_1.Notification),
    __param(0, (0, graphql_1.Args)('updateNoticeInput')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_notice_input_1.UpdateNoticeInput, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], NoticeResolver.prototype, "updateNotice", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], NoticeResolver.prototype, "deleteNotice", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => notice_entity_1.Notification),
    __param(0, (0, graphql_1.Args)('createNoticeInput')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_notice_input_1.CreateNoticeInput, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], NoticeResolver.prototype, "sendNotice", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => notice_response_1.NoticeResponse),
    __param(0, (0, graphql_1.Args)('data')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_email_input_1.SendEmailInput, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], NoticeResolver.prototype, "sendEmailToParent", null);
exports.NoticeResolver = NoticeResolver = __decorate([
    (0, graphql_1.Resolver)(() => notice_entity_1.Notification),
    __metadata("design:paramtypes", [notice_service_1.NoticeService])
], NoticeResolver);
//# sourceMappingURL=notice.resolver.js.map
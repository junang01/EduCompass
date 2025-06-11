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
exports.StudyScheduleResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const studySchedule_entity_1 = require("./entities/studySchedule.entity");
const studyschedule_service_1 = require("./studyschedule.service");
const gql_auth_guard_1 = require("../auth/guards/gql-auth.guard");
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const createStudySchedule_input_1 = require("./dto/createStudySchedule.input");
let StudyScheduleResolver = class StudyScheduleResolver {
    constructor(studyScheduleService) {
        this.studyScheduleService = studyScheduleService;
    }
    async createSchedule(createStudyScheduleInput, user) {
        return await this.studyScheduleService.create({ createStudyScheduleInput, user });
    }
    async updateSchedule(updateScheduleInput, user) {
        return await this.studyScheduleService.update({ updateScheduleInput, user });
    }
    async updateCompleted(id, user) {
        return await this.studyScheduleService.completeUpdate({ id, user });
    }
    async findScheduleDateRange(startTime, endTime, user) {
        return await this.studyScheduleService.findByDateRange({ startTime, endTime, user });
    }
    async deleteSchedule(id, user) {
        return await this.studyScheduleService.delete({ id, user });
    }
    async delaySchedule(updateScheduleInput, user) {
        return await this.studyScheduleService.delay({ updateScheduleInput, user });
    }
};
exports.StudyScheduleResolver = StudyScheduleResolver;
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => studySchedule_entity_1.StudySchedule),
    __param(0, (0, graphql_1.Args)('createStudyScheduleInput')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createStudySchedule_input_1.CreateStudyScheduleInput,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], StudyScheduleResolver.prototype, "createSchedule", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => studySchedule_entity_1.StudySchedule),
    __param(0, (0, graphql_1.Args)('updateScheduleInput')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createStudySchedule_input_1.UpdateScheduleInput,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], StudyScheduleResolver.prototype, "updateSchedule", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => studySchedule_entity_1.StudySchedule),
    __param(0, (0, graphql_1.Args)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], StudyScheduleResolver.prototype, "updateCompleted", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => [studySchedule_entity_1.StudySchedule]),
    __param(0, (0, graphql_1.Args)('startTime')),
    __param(1, (0, graphql_1.Args)('endTime')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], StudyScheduleResolver.prototype, "findScheduleDateRange", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], StudyScheduleResolver.prototype, "deleteSchedule", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => studySchedule_entity_1.StudySchedule),
    __param(0, (0, graphql_1.Args)('updateScheduleInput')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createStudySchedule_input_1.UpdateScheduleInput,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], StudyScheduleResolver.prototype, "delaySchedule", null);
exports.StudyScheduleResolver = StudyScheduleResolver = __decorate([
    (0, graphql_1.Resolver)(() => studySchedule_entity_1.StudySchedule),
    __metadata("design:paramtypes", [studyschedule_service_1.StudyScheduleService])
], StudyScheduleResolver);
//# sourceMappingURL=studySchedule.resolver.js.map
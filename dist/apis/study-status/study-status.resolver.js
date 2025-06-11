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
exports.StudyStatusResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const study_status_service_1 = require("./study-status.service");
const study_status_entity_1 = require("./entities/study-status.entity");
const create_study_status_input_1 = require("./dto/create-study-status.input");
const gql_auth_guard_1 = require("../auth/guards/gql-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
let StudyStatusResolver = class StudyStatusResolver {
    constructor(studyStatusService) {
        this.studyStatusService = studyStatusService;
    }
    async getStudyStatus(id, user) {
        return this.studyStatusService.getStudyStatusByPlan({ id, user });
    }
};
exports.StudyStatusResolver = StudyStatusResolver;
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => [create_study_status_input_1.CreateStudyStatusInput]),
    __param(0, (0, graphql_1.Args)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], StudyStatusResolver.prototype, "getStudyStatus", null);
exports.StudyStatusResolver = StudyStatusResolver = __decorate([
    (0, graphql_1.Resolver)(() => study_status_entity_1.StudyStatus),
    __metadata("design:paramtypes", [study_status_service_1.StudyStatusService])
], StudyStatusResolver);
//# sourceMappingURL=study-status.resolver.js.map
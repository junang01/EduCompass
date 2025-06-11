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
exports.StudyPlansResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const study_plans_service_1 = require("./study-plans.service");
const study_plan_entity_1 = require("./entities/study-plan.entity");
const create_study_plan_input_1 = require("./dto/create-study-plan.input");
const gql_auth_guard_1 = require("../auth/guards/gql-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const featureUsage_service_1 = require("../featureUsage/featureUsage.service");
let StudyPlansResolver = class StudyPlansResolver {
    constructor(studyPlansService, featureUsageService) {
        this.studyPlansService = studyPlansService;
        this.featureUsageService = featureUsageService;
    }
    async createStudyPlan(createStudyPlanInput, user) {
        const userId = user.id;
        const featureName = 'CreateStudyPlan';
        const findUsageReturn = await this.featureUsageService.canUsage({ userId, featureName });
        const studyPlan = await this.studyPlansService.createStudyPlan({ userId, createStudyPlanInput });
        await this.featureUsageService.saveUsage({ userId, featureName }, findUsageReturn);
        return studyPlan;
    }
    async findStudyPlans(user) {
        return await this.studyPlansService.findAll({ user });
    }
    async findStudyPlan(studyPlanId, user) {
        return await this.studyPlansService.findOne({ studyPlanId, user });
    }
};
exports.StudyPlansResolver = StudyPlansResolver;
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => study_plan_entity_1.StudyPlan),
    __param(0, (0, graphql_1.Args)('createStudyPlanInput')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_study_plan_input_1.CreateStudyPlanInput, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], StudyPlansResolver.prototype, "createStudyPlan", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => [study_plan_entity_1.StudyPlan]),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], StudyPlansResolver.prototype, "findStudyPlans", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => study_plan_entity_1.StudyPlan),
    __param(0, (0, graphql_1.Args)('studyPlanId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], StudyPlansResolver.prototype, "findStudyPlan", null);
exports.StudyPlansResolver = StudyPlansResolver = __decorate([
    (0, graphql_1.Resolver)(() => study_plan_entity_1.StudyPlan),
    __metadata("design:paramtypes", [study_plans_service_1.StudyPlansService,
        featureUsage_service_1.FeatureUsageService])
], StudyPlansResolver);
//# sourceMappingURL=study-plans.resolver.js.map
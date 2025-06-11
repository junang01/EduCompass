"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudyPlanModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const study_plans_service_1 = require("./study-plans.service");
const study_plans_resolver_1 = require("./study-plans.resolver");
const study_plan_entity_1 = require("./entities/study-plan.entity");
const subject_entity_1 = require("../subject/entities/subject.entity");
const studySchedule_entity_1 = require("../studySchedule/entities/studySchedule.entity");
const subject_module_1 = require("../subject/subject.module");
const featureUsage_entity_1 = require("../featureUsage/entities/featureUsage.entity");
const featureUsage_service_1 = require("../featureUsage/featureUsage.service");
const chatGptPrompt_entity_1 = require("./entities/chatGptPrompt.entity");
let StudyPlanModule = class StudyPlanModule {
};
exports.StudyPlanModule = StudyPlanModule;
exports.StudyPlanModule = StudyPlanModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([study_plan_entity_1.StudyPlan, subject_entity_1.Subject, studySchedule_entity_1.StudySchedule, featureUsage_entity_1.FeatureUsage, chatGptPrompt_entity_1.ChatGptPrompt]), subject_module_1.SubjectModule],
        providers: [study_plans_resolver_1.StudyPlansResolver, study_plans_service_1.StudyPlansService, featureUsage_service_1.FeatureUsageService],
        exports: [study_plans_service_1.StudyPlansService],
    })
], StudyPlanModule);
//# sourceMappingURL=study-plans.module.js.map
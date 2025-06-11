"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudyStatusModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const study_status_entity_1 = require("./entities/study-status.entity");
const study_status_service_1 = require("./study-status.service");
const study_status_resolver_1 = require("./study-status.resolver");
const subject_entity_1 = require("../subject/entities/subject.entity");
const studyschedule_entity_1 = require("../studyschedule/entities/studyschedule.entity");
const study_plan_entity_1 = require("../study-plan/entities/study-plan.entity");
let StudyStatusModule = class StudyStatusModule {
};
exports.StudyStatusModule = StudyStatusModule;
exports.StudyStatusModule = StudyStatusModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([study_status_entity_1.StudyStatus, subject_entity_1.Subject, studyschedule_entity_1.StudySchedule, study_plan_entity_1.StudyPlan])],
        providers: [study_status_service_1.StudyStatusService, study_status_resolver_1.StudyStatusResolver],
        exports: [study_status_service_1.StudyStatusService],
    })
], StudyStatusModule);
//# sourceMappingURL=study-status.module.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudyScheduleModule = void 0;
const common_1 = require("@nestjs/common");
const studySchedule_entity_1 = require("./entities/studySchedule.entity");
const typeorm_1 = require("@nestjs/typeorm");
const studySchedule_resolver_1 = require("./studySchedule.resolver");
const studyschedule_service_1 = require("./studyschedule.service");
let StudyScheduleModule = class StudyScheduleModule {
};
exports.StudyScheduleModule = StudyScheduleModule;
exports.StudyScheduleModule = StudyScheduleModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([studySchedule_entity_1.StudySchedule])],
        providers: [studySchedule_resolver_1.StudyScheduleResolver, studyschedule_service_1.StudyScheduleService],
        exports: []
    })
], StudyScheduleModule);
//# sourceMappingURL=studySchedule.module.js.map
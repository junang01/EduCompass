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
exports.StudyStatusService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const study_plan_entity_1 = require("../study-plan/entities/study-plan.entity");
const studySchedule_entity_1 = require("../studySchedule/entities/studySchedule.entity");
let StudyStatusService = class StudyStatusService {
    constructor(studyPlanRepository, studyScheduleRepository) {
        this.studyPlanRepository = studyPlanRepository;
        this.studyScheduleRepository = studyScheduleRepository;
    }
    async getStudyStatusByPlan({ id, user }) {
        const plan = await this.studyPlanRepository.findOne({
            where: { id, user: { id: user.id } },
            relations: ['schedules', 'schedules.subject'],
        });
        if (!plan) {
            throw new common_1.NotFoundException('해당 계획이 없습니다/');
        }
        const [startStr, endStr] = plan.studyPeriod.split('to').map(s => s.trim());
        const startDate = new Date(startStr);
        const endDate = new Date(endStr);
        const today = new Date();
        const schedulesBySubject = plan.schedules.reduce((acc, schedule) => {
            if (!schedule.subject)
                return acc;
            const subjectId = schedule.subject.id;
            if (!acc[subjectId])
                acc[subjectId] = [];
            acc[subjectId].push(schedule);
            return acc;
        }, {});
        const result = [];
        for (const subjectId in schedulesBySubject) {
            const schedules = schedulesBySubject[subjectId];
            const total = schedules.length;
            const completedCount = schedules.filter(s => s.completed).length;
            const delayCount = schedules.filter(s => s.delay).length;
            const completionRate = total === 0 ? 0 : (completedCount / total) * 100;
            const postponeRate = total === 0 ? 0 : (delayCount / total) * 100;
            let remainingPeriodPercent = 0;
            if (today < startDate)
                remainingPeriodPercent = 0;
            else if (today > endDate)
                remainingPeriodPercent = 100;
            else {
                const elapsed = today.getTime() - startDate.getTime();
                const totalDuration = endDate.getTime() - startDate.getTime();
                remainingPeriodPercent = (elapsed / totalDuration) * 100;
            }
            result.push({
                subjectId: Number(subjectId),
                subjectName: schedules[0].subject.subjectName,
                completionRate,
                postponeRate,
                remainingPeriodPercent,
                totalSchedules: total,
            });
        }
        return result;
    }
};
exports.StudyStatusService = StudyStatusService;
exports.StudyStatusService = StudyStatusService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(study_plan_entity_1.StudyPlan)),
    __param(1, (0, typeorm_1.InjectRepository)(studySchedule_entity_1.StudySchedule)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], StudyStatusService);
//# sourceMappingURL=study-status.service.js.map
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
exports.StudyScheduleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const studySchedule_entity_1 = require("./entities/studySchedule.entity");
const typeorm_2 = require("typeorm");
let StudyScheduleService = class StudyScheduleService {
    constructor(studyScheduleRepository) {
        this.studyScheduleRepository = studyScheduleRepository;
    }
    async create({ createStudyScheduleInput, user }) {
        const { startTime, endTime, content } = createStudyScheduleInput;
        const result = await this.studyScheduleRepository.save({
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            content,
            user
        });
        return result;
    }
    async delay({ updateScheduleInput, user }) {
        const { id } = updateScheduleInput;
        const schedule = await this.findOne({ id, user });
        return await this.studyScheduleRepository.save({
            ...schedule,
            ...updateScheduleInput,
            delay: true
        });
    }
    async update({ updateScheduleInput, user }) {
        const { id } = updateScheduleInput;
        const schedule = await this.findOne({ id, user });
        return await this.studyScheduleRepository.save({
            ...schedule,
            ...updateScheduleInput
        });
    }
    async completeUpdate({ id, user }) {
        const schedule = await this.findOne({ id, user });
        if (schedule.completed) {
            const result = await this.studyScheduleRepository.save({
                ...schedule,
                completed: false
            });
            return result;
        }
        const result = await this.studyScheduleRepository.save({
            ...schedule,
            completed: true
        });
        return result;
    }
    async findOne({ id, user }) {
        const schedule = await this.studyScheduleRepository.findOne({
            where: { id, user: { id: user.id } },
        });
        if (!schedule)
            throw new Error('스케줄을 찾을 수 없습니다.');
        return schedule;
    }
    async findByDateRange({ startTime, endTime, user }) {
        const result = await this.studyScheduleRepository.find({
            where: {
                user: { id: user.id },
                startTime: (0, typeorm_2.Between)(new Date(startTime), new Date(endTime)),
            },
            relations: ['subject'],
            order: { startTime: 'ASC' }
        });
        return result;
    }
    async delete({ id, user }) {
        const result = await this.studyScheduleRepository.delete({
            id,
            user: { id: user.id }
        });
        if (!result.affected)
            throw new Error("삭제할 스케줄이 없습니다!");
        return true;
    }
};
exports.StudyScheduleService = StudyScheduleService;
exports.StudyScheduleService = StudyScheduleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(studySchedule_entity_1.StudySchedule)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StudyScheduleService);
//# sourceMappingURL=studyschedule.service.js.map
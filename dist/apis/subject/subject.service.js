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
exports.SubjectService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const subject_entity_1 = require("./entities/subject.entity");
let SubjectService = class SubjectService {
    constructor(subjectRepository) {
        this.subjectRepository = subjectRepository;
    }
    async findAll() {
        return this.subjectRepository.find();
    }
    async findOne(id) {
        const subject = await this.subjectRepository.findOne({ where: { id } });
        if (!subject) {
            throw new common_1.NotFoundException(`Subject with ID ${id} not found`);
        }
        return subject;
    }
    async create(subjectName) {
        const newSubject = this.subjectRepository.create({ subjectName });
        return this.subjectRepository.save(newSubject);
    }
    async update(id, subjectData) {
        const subject = await this.findOne(id);
        Object.assign(subject, subjectData);
        return this.subjectRepository.save(subject);
    }
    async delete(id) {
        const result = await this.subjectRepository.delete(id);
        return result.affected > 0;
    }
    async findOrCreateByName(subjectName) {
        const subject = await this.subjectRepository.findOne({ where: { subjectName } });
        if (!subject) {
            const newSubject = this.create(subjectName);
            return newSubject;
        }
        return subject;
    }
    async find({ subjectTitles }) {
        const subject = await this.subjectRepository.find({
            where: {
                subjectName: (0, typeorm_2.In)(subjectTitles),
            },
        });
        if (!subject)
            throw new Error('찾는 과목이 없습니다.');
        return subject;
    }
};
exports.SubjectService = SubjectService;
exports.SubjectService = SubjectService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subject_entity_1.Subject)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SubjectService);
//# sourceMappingURL=subject.service.js.map
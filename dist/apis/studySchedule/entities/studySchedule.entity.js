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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudySchedule = void 0;
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const study_plan_entity_1 = require("../../study-plan/entities/study-plan.entity");
const subject_entity_1 = require("../../subject/entities/subject.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let StudySchedule = class StudySchedule {
};
exports.StudySchedule = StudySchedule;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StudySchedule.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], StudySchedule.prototype, "startTime", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], StudySchedule.prototype, "endTime", void 0);
__decorate([
    (0, graphql_1.Field)(() => subject_entity_1.Subject, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => subject_entity_1.Subject, { nullable: true }),
    __metadata("design:type", subject_entity_1.Subject)
], StudySchedule.prototype, "subject", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StudySchedule.prototype, "content", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], StudySchedule.prototype, "completed", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], StudySchedule.prototype, "delay", void 0);
__decorate([
    (0, typeorm_1.JoinColumn)(),
    (0, graphql_1.Field)(() => user_entity_1.User),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (User) => User.studySchedule, { onDelete: 'CASCADE' }),
    __metadata("design:type", user_entity_1.User)
], StudySchedule.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.JoinColumn)(),
    (0, typeorm_1.ManyToOne)(() => study_plan_entity_1.StudyPlan, (studyPlan) => studyPlan.schedules, {
        onDelete: 'CASCADE',
        nullable: true,
    }),
    (0, graphql_1.Field)(() => study_plan_entity_1.StudyPlan),
    __metadata("design:type", study_plan_entity_1.StudyPlan)
], StudySchedule.prototype, "studyPlan", void 0);
exports.StudySchedule = StudySchedule = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], StudySchedule);
//# sourceMappingURL=studySchedule.entity.js.map
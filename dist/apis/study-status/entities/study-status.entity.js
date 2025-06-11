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
exports.StudyStatus = void 0;
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const study_plan_entity_1 = require("../../study-plan/entities/study-plan.entity");
const subject_entity_1 = require("../../subject/entities/subject.entity");
let StudyStatus = class StudyStatus {
};
exports.StudyStatus = StudyStatus;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StudyStatus.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], StudyStatus.prototype, "completionRate", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], StudyStatus.prototype, "delayRate", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], StudyStatus.prototype, "remainingPercent", void 0);
__decorate([
    (0, typeorm_1.JoinColumn)({ name: 'subject_seq' }),
    (0, graphql_1.Field)(() => subject_entity_1.Subject),
    (0, typeorm_1.ManyToOne)(() => subject_entity_1.Subject),
    __metadata("design:type", subject_entity_1.Subject)
], StudyStatus.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.JoinColumn)({ name: 'subjectId' }),
    (0, typeorm_1.ManyToOne)(() => study_plan_entity_1.StudyPlan),
    (0, graphql_1.Field)(() => study_plan_entity_1.StudyPlan),
    __metadata("design:type", study_plan_entity_1.StudyPlan)
], StudyStatus.prototype, "studyPlan", void 0);
__decorate([
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, graphql_1.Field)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], StudyStatus.prototype, "user", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], StudyStatus.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], StudyStatus.prototype, "updatedAt", void 0);
exports.StudyStatus = StudyStatus = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], StudyStatus);
//# sourceMappingURL=study-status.entity.js.map
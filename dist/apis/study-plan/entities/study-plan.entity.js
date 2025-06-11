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
exports.StudyPlan = void 0;
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const studySchedule_entity_1 = require("../../studySchedule/entities/studySchedule.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let StudyPlan = class StudyPlan {
};
exports.StudyPlan = StudyPlan;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StudyPlan.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StudyPlan.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StudyPlan.prototype, "studyPeriod", void 0);
__decorate([
    (0, graphql_1.Field)(() => [studySchedule_entity_1.StudySchedule]),
    (0, typeorm_1.OneToMany)(() => studySchedule_entity_1.StudySchedule, (schedule) => schedule.studyPlan),
    __metadata("design:type", Array)
], StudyPlan.prototype, "schedules", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], StudyPlan.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], StudyPlan.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    (0, graphql_1.Field)(() => user_entity_1.User),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.studyPlans),
    __metadata("design:type", user_entity_1.User)
], StudyPlan.prototype, "user", void 0);
exports.StudyPlan = StudyPlan = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], StudyPlan);
//# sourceMappingURL=study-plan.entity.js.map
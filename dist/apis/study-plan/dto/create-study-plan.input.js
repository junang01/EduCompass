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
exports.TimeRangeInput = exports.StudyBookInput = exports.ExamContentInput = exports.AvailableStudyScheduleInput = exports.SubjectInput = exports.CreateStudyPlanInput = void 0;
const graphql_1 = require("@nestjs/graphql");
let CreateStudyPlanInput = class CreateStudyPlanInput {
};
exports.CreateStudyPlanInput = CreateStudyPlanInput;
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], CreateStudyPlanInput.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], CreateStudyPlanInput.prototype, "studyPeriod", void 0);
__decorate([
    (0, graphql_1.Field)(() => [AvailableStudyScheduleInput]),
    __metadata("design:type", Array)
], CreateStudyPlanInput.prototype, "availableStudyScheduleInput", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], CreateStudyPlanInput.prototype, "learningStyle", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], CreateStudyPlanInput.prototype, "reviewDays", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], CreateStudyPlanInput.prototype, "missedPlanDays", void 0);
__decorate([
    (0, graphql_1.Field)(() => [SubjectInput]),
    __metadata("design:type", Array)
], CreateStudyPlanInput.prototype, "subjects", void 0);
exports.CreateStudyPlanInput = CreateStudyPlanInput = __decorate([
    (0, graphql_1.InputType)()
], CreateStudyPlanInput);
let SubjectInput = class SubjectInput {
};
exports.SubjectInput = SubjectInput;
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], SubjectInput.prototype, "subject", void 0);
__decorate([
    (0, graphql_1.Field)(() => [StudyBookInput]),
    __metadata("design:type", Array)
], SubjectInput.prototype, "studyBookInput", void 0);
__decorate([
    (0, graphql_1.Field)(() => [ExamContentInput]),
    __metadata("design:type", Array)
], SubjectInput.prototype, "examContentInput", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], SubjectInput.prototype, "studyLevel", void 0);
exports.SubjectInput = SubjectInput = __decorate([
    (0, graphql_1.InputType)()
], SubjectInput);
let AvailableStudyScheduleInput = class AvailableStudyScheduleInput {
};
exports.AvailableStudyScheduleInput = AvailableStudyScheduleInput;
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], AvailableStudyScheduleInput.prototype, "day", void 0);
__decorate([
    (0, graphql_1.Field)(() => [TimeRangeInput]),
    __metadata("design:type", Array)
], AvailableStudyScheduleInput.prototype, "timeRanges", void 0);
exports.AvailableStudyScheduleInput = AvailableStudyScheduleInput = __decorate([
    (0, graphql_1.InputType)()
], AvailableStudyScheduleInput);
let ExamContentInput = class ExamContentInput {
};
exports.ExamContentInput = ExamContentInput;
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], ExamContentInput.prototype, "examcontent", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], ExamContentInput.prototype, "examStartDay", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], ExamContentInput.prototype, "examLastScore", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], ExamContentInput.prototype, "examGoalScore", void 0);
exports.ExamContentInput = ExamContentInput = __decorate([
    (0, graphql_1.InputType)()
], ExamContentInput);
let StudyBookInput = class StudyBookInput {
};
exports.StudyBookInput = StudyBookInput;
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], StudyBookInput.prototype, "bookName", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], StudyBookInput.prototype, "bookIndex", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], StudyBookInput.prototype, "bookReview", void 0);
exports.StudyBookInput = StudyBookInput = __decorate([
    (0, graphql_1.InputType)()
], StudyBookInput);
let TimeRangeInput = class TimeRangeInput {
};
exports.TimeRangeInput = TimeRangeInput;
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], TimeRangeInput.prototype, "startTime", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], TimeRangeInput.prototype, "endTime", void 0);
exports.TimeRangeInput = TimeRangeInput = __decorate([
    (0, graphql_1.InputType)()
], TimeRangeInput);
//# sourceMappingURL=create-study-plan.input.js.map
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
exports.UpdateScheduleInput = exports.CreateStudyScheduleInput = void 0;
const graphql_1 = require("@nestjs/graphql");
let CreateStudyScheduleInput = class CreateStudyScheduleInput {
};
exports.CreateStudyScheduleInput = CreateStudyScheduleInput;
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], CreateStudyScheduleInput.prototype, "startTime", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], CreateStudyScheduleInput.prototype, "endTime", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], CreateStudyScheduleInput.prototype, "content", void 0);
exports.CreateStudyScheduleInput = CreateStudyScheduleInput = __decorate([
    (0, graphql_1.InputType)()
], CreateStudyScheduleInput);
let UpdateScheduleInput = class UpdateScheduleInput {
};
exports.UpdateScheduleInput = UpdateScheduleInput;
__decorate([
    (0, graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], UpdateScheduleInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], UpdateScheduleInput.prototype, "content", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    __metadata("design:type", Date)
], UpdateScheduleInput.prototype, "startTime", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    __metadata("design:type", Date)
], UpdateScheduleInput.prototype, "endTime", void 0);
exports.UpdateScheduleInput = UpdateScheduleInput = __decorate([
    (0, graphql_1.InputType)()
], UpdateScheduleInput);
//# sourceMappingURL=createStudySchedule.input.js.map
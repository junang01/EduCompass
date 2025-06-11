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
exports.OverallStatsResponse = exports.SubjectStat = void 0;
const graphql_1 = require("@nestjs/graphql");
let SubjectStat = class SubjectStat {
};
exports.SubjectStat = SubjectStat;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], SubjectStat.prototype, "subject", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], SubjectStat.prototype, "completionRate", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], SubjectStat.prototype, "postponeRate", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], SubjectStat.prototype, "incompleteRate", void 0);
exports.SubjectStat = SubjectStat = __decorate([
    (0, graphql_1.ObjectType)()
], SubjectStat);
let OverallStatsResponse = class OverallStatsResponse {
};
exports.OverallStatsResponse = OverallStatsResponse;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], OverallStatsResponse.prototype, "completionRate", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], OverallStatsResponse.prototype, "postponeRate", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], OverallStatsResponse.prototype, "incompleteRate", void 0);
__decorate([
    (0, graphql_1.Field)(() => [SubjectStat]),
    __metadata("design:type", Array)
], OverallStatsResponse.prototype, "subjectStats", void 0);
exports.OverallStatsResponse = OverallStatsResponse = __decorate([
    (0, graphql_1.ObjectType)()
], OverallStatsResponse);
//# sourceMappingURL=overall-stats.response.js.map
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
exports.SubjectResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const subject_service_1 = require("./subject.service");
const subject_entity_1 = require("./entities/subject.entity");
const create_subject_input_1 = require("./dto/create-subject.input");
const update_subject_input_1 = require("./dto/update-subject.input");
const gql_auth_guard_1 = require("../auth/guards/gql-auth.guard");
let SubjectResolver = class SubjectResolver {
    constructor(subjectService) {
        this.subjectService = subjectService;
    }
    async subjects() {
        return this.subjectService.findAll();
    }
    async subject(id) {
        return this.subjectService.findOne(id);
    }
    async createSubject(createSubjectInput) {
        return this.subjectService.create(createSubjectInput);
    }
    async updateSubject(updateSubjectInput) {
        return this.subjectService.update(updateSubjectInput.id, updateSubjectInput);
    }
    async deleteSubject(id) {
        return this.subjectService.delete(id);
    }
};
exports.SubjectResolver = SubjectResolver;
__decorate([
    (0, graphql_1.Query)(() => [subject_entity_1.Subject]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubjectResolver.prototype, "subjects", null);
__decorate([
    (0, graphql_1.Query)(() => subject_entity_1.Subject),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SubjectResolver.prototype, "subject", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => subject_entity_1.Subject),
    __param(0, (0, graphql_1.Args)('createSubjectInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_subject_input_1.CreateSubjectInput]),
    __metadata("design:returntype", Promise)
], SubjectResolver.prototype, "createSubject", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => subject_entity_1.Subject),
    __param(0, (0, graphql_1.Args)('updateSubjectInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_subject_input_1.UpdateSubjectInput]),
    __metadata("design:returntype", Promise)
], SubjectResolver.prototype, "updateSubject", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SubjectResolver.prototype, "deleteSubject", null);
exports.SubjectResolver = SubjectResolver = __decorate([
    (0, graphql_1.Resolver)(() => subject_entity_1.Subject),
    __metadata("design:paramtypes", [subject_service_1.SubjectService])
], SubjectResolver);
//# sourceMappingURL=subject.resolver.js.map
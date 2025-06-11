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
exports.BookSaveResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const booksave_service_1 = require("./booksave.service");
const booksave_entity_1 = require("./entities/booksave.entity");
const create_booksave_dto_1 = require("./dto/create-booksave.dto");
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const gql_auth_guard_1 = require("../auth/guards/gql-auth.guard");
let BookSaveResolver = class BookSaveResolver {
    constructor(bookSaveService) {
        this.bookSaveService = bookSaveService;
    }
    createBookSave(createBookSaveDto, user) {
        createBookSaveDto.userId = user.id;
        return this.bookSaveService.create(createBookSaveDto);
    }
    findAll() {
        return this.bookSaveService.findAll();
    }
    findByUser(user) {
        return this.bookSaveService.findByUser(user.id);
    }
    findOne(id) {
        return this.bookSaveService.findOne(id);
    }
    removeBookSave(id) {
        return this.bookSaveService.delete(id);
    }
};
exports.BookSaveResolver = BookSaveResolver;
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => booksave_entity_1.BookSave),
    __param(0, (0, graphql_1.Args)('createBookSaveInput')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_booksave_dto_1.CreateBookSaveDto, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], BookSaveResolver.prototype, "createBookSave", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => [booksave_entity_1.BookSave], { name: 'bookSaves' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BookSaveResolver.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => [booksave_entity_1.BookSave], { name: 'userBookSaves' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", void 0)
], BookSaveResolver.prototype, "findByUser", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => booksave_entity_1.BookSave, { name: 'bookSave' }),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], BookSaveResolver.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], BookSaveResolver.prototype, "removeBookSave", null);
exports.BookSaveResolver = BookSaveResolver = __decorate([
    (0, graphql_1.Resolver)(() => booksave_entity_1.BookSave),
    __metadata("design:paramtypes", [booksave_service_1.BookSaveService])
], BookSaveResolver);
//# sourceMappingURL=booksave.resolver.js.map
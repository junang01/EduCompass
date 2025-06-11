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
exports.BookRecommendationResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const book_rec_service_1 = require("./book-rec.service");
const book_rec_entity_1 = require("./entities/book-rec.entity");
const create_book_rec_input_1 = require("./dto/create-book-rec.input");
const update_book_rec_input_1 = require("./dto/update-book-rec.input");
const book_rec_args_1 = require("./dto/book-rec.args");
const gql_auth_guard_1 = require("../auth/guards/gql-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
let BookRecommendationResolver = class BookRecommendationResolver {
    constructor(bookRecommendationService) {
        this.bookRecommendationService = bookRecommendationService;
    }
    async bookRecommendations(user, args) {
        return this.bookRecommendationService.findAll(user.id, args);
    }
    async bookRecommendation(id, user) {
        return this.bookRecommendationService.findOne(id, user.id);
    }
    async createBookRecommendation(createBookRecommendationInput, user) {
        return this.bookRecommendationService.create({
            ...createBookRecommendationInput,
            userId: user.id,
        });
    }
    async updateBookRecommendation(updateBookRecommendationInput, user) {
        return this.bookRecommendationService.update(updateBookRecommendationInput.id, updateBookRecommendationInput, user.id);
    }
    async deleteBookRecommendation(id, user) {
        return this.bookRecommendationService.delete(id, user.id);
    }
    async toggleFavorite(id, user) {
        return this.bookRecommendationService.toggleFavorite(id, user.id);
    }
    async getBookRecommendations(subject, user) {
        return this.bookRecommendationService.getRecommendations(user.id, subject);
    }
};
exports.BookRecommendationResolver = BookRecommendationResolver;
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => [book_rec_entity_1.BookRecommendation]),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        book_rec_args_1.BookRecommendationArgs]),
    __metadata("design:returntype", Promise)
], BookRecommendationResolver.prototype, "bookRecommendations", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => book_rec_entity_1.BookRecommendation),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], BookRecommendationResolver.prototype, "bookRecommendation", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => book_rec_entity_1.BookRecommendation),
    __param(0, (0, graphql_1.Args)('createBookRecommendationInput')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_book_rec_input_1.CreateBookRecommendationInput,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], BookRecommendationResolver.prototype, "createBookRecommendation", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => book_rec_entity_1.BookRecommendation),
    __param(0, (0, graphql_1.Args)('updateBookRecommendationInput')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_book_rec_input_1.UpdateBookRecommendationInput,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], BookRecommendationResolver.prototype, "updateBookRecommendation", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], BookRecommendationResolver.prototype, "deleteBookRecommendation", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => book_rec_entity_1.BookRecommendation),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], BookRecommendationResolver.prototype, "toggleFavorite", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => [book_rec_entity_1.BookRecommendation]),
    __param(0, (0, graphql_1.Args)('subject')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], BookRecommendationResolver.prototype, "getBookRecommendations", null);
exports.BookRecommendationResolver = BookRecommendationResolver = __decorate([
    (0, graphql_1.Resolver)(() => book_rec_entity_1.BookRecommendation),
    __metadata("design:paramtypes", [book_rec_service_1.BookRecommendationService])
], BookRecommendationResolver);
//# sourceMappingURL=book-rec.resolver.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookRecommendationModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const book_rec_entity_1 = require("./entities/book-rec.entity");
const book_entity_1 = require("../book/entities/book.entity");
const subject_entity_1 = require("../subject/entities/subject.entity");
const book_rec_service_1 = require("./book-rec.service");
const book_rec_resolver_1 = require("./book-rec.resolver");
let BookRecommendationModule = class BookRecommendationModule {
};
exports.BookRecommendationModule = BookRecommendationModule;
exports.BookRecommendationModule = BookRecommendationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([book_rec_entity_1.BookRecommendation, book_entity_1.Book, subject_entity_1.Subject]),
        ],
        providers: [book_rec_service_1.BookRecommendationService, book_rec_resolver_1.BookRecommendationResolver],
        exports: [book_rec_service_1.BookRecommendationService],
    })
], BookRecommendationModule);
//# sourceMappingURL=book-rec.module.js.map
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
exports.BookRecommendationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const book_rec_entity_1 = require("./entities/book-rec.entity");
const book_entity_1 = require("../book/entities/book.entity");
const subject_entity_1 = require("../subject/entities/subject.entity");
let BookRecommendationService = class BookRecommendationService {
    constructor(bookRecommendationRepository, bookRepository, subjectRepository) {
        this.bookRecommendationRepository = bookRecommendationRepository;
        this.bookRepository = bookRepository;
        this.subjectRepository = subjectRepository;
    }
    async findAll(userId, args) {
        const query = this.bookRecommendationRepository.createQueryBuilder('bookRecommendation')
            .leftJoinAndSelect('bookRecommendation.book', 'book')
            .where('bookRecommendation.userId = :userId', { userId });
        if (args?.isFavorite !== undefined) {
            query.andWhere('bookRecommendation.isFavorite = :isFavorite', { isFavorite: args.isFavorite });
        }
        return query.getMany();
    }
    async findOne(id, userId) {
        const bookRecommendation = await this.bookRecommendationRepository.findOne({
            where: { id },
            relations: ['book'],
        });
        if (!bookRecommendation) {
            throw new common_1.NotFoundException(`Book recommendation with ID ${id} not found`);
        }
        if (userId && bookRecommendation.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to access this recommendation');
        }
        return bookRecommendation;
    }
    async create(bookRecommendation) {
        const book = await this.bookRepository.findOne({ where: { id: bookRecommendation.bookId } });
        if (!book) {
            throw new common_1.NotFoundException(`Book with ID ${bookRecommendation.bookId} not found`);
        }
        const existingRecommendation = await this.bookRecommendationRepository.findOne({
            where: {
                userId: bookRecommendation.userId,
                bookId: bookRecommendation.bookId,
            },
        });
        if (existingRecommendation) {
            return existingRecommendation;
        }
        const newBookRecommendation = this.bookRecommendationRepository.create(bookRecommendation);
        return this.bookRecommendationRepository.save(newBookRecommendation);
    }
    async update(id, bookRecommendationData, userId) {
        const bookRecommendation = await this.findOne(id, userId);
        Object.assign(bookRecommendation, bookRecommendationData);
        return this.bookRecommendationRepository.save(bookRecommendation);
    }
    async delete(id, userId) {
        await this.findOne(id, userId);
        const result = await this.bookRecommendationRepository.delete(id);
        return result.affected > 0;
    }
    async toggleFavorite(id, userId) {
        const bookRecommendation = await this.findOne(id, userId);
        bookRecommendation.isFavorite = !bookRecommendation.isFavorite;
        return this.bookRecommendationRepository.save(bookRecommendation);
    }
    async getRecommendations(userId, subjectName) {
        const subjectEntity = await this.subjectRepository.findOne({ where: { subjectName } });
        if (!subjectEntity) {
            return [];
        }
        const books = await this.bookRepository.find({
            where: { subject_seq: subjectEntity.id },
            take: 3,
        });
        const recommendations = [];
        for (const book of books) {
            const recommendation = await this.create({
                userId,
                bookId: book.id,
            });
            recommendations.push({
                ...recommendation,
                book,
            });
        }
        return recommendations;
    }
};
exports.BookRecommendationService = BookRecommendationService;
exports.BookRecommendationService = BookRecommendationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(book_rec_entity_1.BookRecommendation)),
    __param(1, (0, typeorm_1.InjectRepository)(book_entity_1.Book)),
    __param(2, (0, typeorm_1.InjectRepository)(subject_entity_1.Subject)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BookRecommendationService);
//# sourceMappingURL=book-rec.service.js.map
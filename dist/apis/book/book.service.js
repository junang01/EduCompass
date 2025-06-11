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
exports.BookService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const book_entity_1 = require("./entities/book.entity");
const subject_entity_1 = require("../subject/entities/subject.entity");
let BookService = class BookService {
    constructor(bookRepository, subjectRepository) {
        this.bookRepository = bookRepository;
        this.subjectRepository = subjectRepository;
    }
    async findAll(args) {
        const query = this.bookRepository.createQueryBuilder('book')
            .leftJoinAndSelect('book.subject', 'subject');
        if (args?.subject) {
            const subject = await this.subjectRepository.findOne({
                where: { subjectName: args.subject }
            });
            if (subject) {
                query.andWhere('book.subject_seq = :subject_seq', { subject_seq: subject.id });
            }
        }
        if (args?.title) {
            query.andWhere('book.title LIKE :title', { title: `%${args.title}%` });
        }
        if (args?.author) {
            query.andWhere('book.author LIKE :author', { author: `%${args.author}%` });
        }
        return query.getMany();
    }
    async findOne(id) {
        const book = await this.bookRepository.findOne({
            where: { id },
            relations: ['subject']
        });
        if (!book) {
            throw new common_1.NotFoundException(`Book with ID ${id} not found`);
        }
        return book;
    }
    async create(bookData) {
        const newBook = this.bookRepository.create(bookData);
        const savedBook = await this.bookRepository.save(newBook);
        return savedBook;
    }
    async update(id, bookData) {
        const book = await this.findOne(id);
        const { subject, ...rest } = bookData;
        Object.assign(book, rest);
        return this.bookRepository.save(book);
    }
    async delete(id) {
        const result = await this.bookRepository.delete(id);
        return result.affected > 0;
    }
    async findBySubject(subject) {
        const subjectEntity = await this.subjectRepository.findOne({
            where: { subjectName: subject }
        });
        if (!subjectEntity) {
            return [];
        }
        return this.bookRepository.find({
            where: { subject_seq: subjectEntity.id },
            relations: ['subject']
        });
    }
};
exports.BookService = BookService;
exports.BookService = BookService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(book_entity_1.Book)),
    __param(1, (0, typeorm_1.InjectRepository)(subject_entity_1.Subject)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], BookService);
//# sourceMappingURL=book.service.js.map
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
exports.BookSaveService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const booksave_entity_1 = require("./entities/booksave.entity");
let BookSaveService = class BookSaveService {
    constructor(bookSaveRepository) {
        this.bookSaveRepository = bookSaveRepository;
    }
    async create(createBookSaveDto) {
        const bookSave = this.bookSaveRepository.create(createBookSaveDto);
        return this.bookSaveRepository.save(bookSave);
    }
    async findAll() {
        return this.bookSaveRepository.find({
            relations: ['user', 'book'],
        });
    }
    async findByUser(userId) {
        return this.bookSaveRepository.find({
            where: { userId },
            relations: ['book'],
        });
    }
    async findOne(id) {
        const bookSave = await this.bookSaveRepository.findOne({
            where: { id },
            relations: ['user', 'book'],
        });
        if (!bookSave) {
            throw new common_1.NotFoundException(`BookSave with ID ${id} not found`);
        }
        return bookSave;
    }
    async delete(id) {
        const result = await this.bookSaveRepository.delete(id);
        return result.affected > 0;
    }
};
exports.BookSaveService = BookSaveService;
exports.BookSaveService = BookSaveService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booksave_entity_1.BookSave)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BookSaveService);
//# sourceMappingURL=booksave.service.js.map
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
exports.AdminUserSeed = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const bcrypt = require("bcrypt");
let AdminUserSeed = class AdminUserSeed {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async seed() {
        const existingAdmin = await this.userRepository.findOne({
            where: { email: 'admin@educompass.com' },
        });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('admin', 10);
            const adminUser = this.userRepository.create({
                email: 'admin@educompass.com',
                password: hashedPassword,
                name: '관리자',
                role: 'ADMIN',
                school: 'Edu Compass',
                grade: '관리자',
                line: '관리자',
            });
            await this.userRepository.save(adminUser);
            console.log('관리자 계정이 성공적으로 생성되었습니다.');
        }
        else {
            console.log('관리자 계정이 이미 존재합니다.');
        }
    }
};
exports.AdminUserSeed = AdminUserSeed;
exports.AdminUserSeed = AdminUserSeed = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AdminUserSeed);
//# sourceMappingURL=admin-user.seed.js.map
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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("./entities/user.entity");
let UsersService = class UsersService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async findAll() {
        return this.userRepository.find();
    }
    async findOne(id, options) {
        const user = await this.userRepository.findOne({
            where: { id },
            ...(options || {}),
        });
        if (!user) {
            throw new common_1.NotFoundException(`ID ${id}에 해당하는 사용자를 찾을 수 없습니다`);
        }
        return user;
    }
    async findByEmail(email) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new common_1.NotFoundException(`이메일 ${email}에 해당하는 사용자를 찾을 수 없습니다`);
        }
        return user;
    }
    async create(registerUserInput) {
        const existingUser = await this.userRepository.findOne({ where: { email: registerUserInput.email } });
        if (existingUser) {
            throw new common_1.ConflictException('이미 존재하는 이메일입니다');
        }
        const { password, ...userData } = registerUserInput;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = this.userRepository.create({
            ...userData,
            password: hashedPassword,
        });
        return this.userRepository.save(newUser);
    }
    async update(id, userData) {
        const user = await this.findOne(id);
        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }
        Object.assign(user, userData);
        return this.userRepository.save(user);
    }
    async delete(id) {
        await this.softDeleteUser(id);
        return true;
    }
    async validateUser(email, password) {
        try {
            const user = await this.findByEmail(email);
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (isPasswordValid) {
                const { password, ...result } = user;
                return result;
            }
            return null;
        }
        catch (error) {
            return null;
        }
    }
    async softDeleteUser(id) {
        try {
            console.log(`회원 탈퇴 요청: ID ${id}`);
            const result = await this.userRepository.softDelete(id);
            console.log(`softDelete 결과:`, result);
            if (!result.affected) {
                throw new common_1.NotFoundException(`User with ID ${id} not found`);
            }
            const deletedUser = await this.userRepository.findOne({
                where: { id },
                withDeleted: true
            });
            console.log('삭제된 사용자 정보:', deletedUser);
            return true;
        }
        catch (error) {
            console.error('회원 탈퇴 처리 중 오류:', error);
            throw new common_1.InternalServerErrorException('회원 탈퇴 처리 중 오류가 발생했습니다.');
        }
    }
    async restoreUser(id) {
        const result = await this.userRepository.restore(id);
        if (!result.affected) {
            throw new common_1.NotFoundException(`Deleted user with ID ${id} not found`);
        }
    }
    async findAllWithDeleted() {
        return this.userRepository.find({ withDeleted: true });
    }
    async findOnlyDeleted() {
        return this.userRepository.find({
            withDeleted: true,
            where: {
                deletedAt: (0, typeorm_2.Not)((0, typeorm_2.IsNull)())
            }
        });
    }
    async findDeletedUsers() {
        return this.userRepository.find({
            withDeleted: true,
            where: {
                deletedAt: (0, typeorm_2.Not)((0, typeorm_2.IsNull)())
            }
        });
    }
    async isEmailTaken(email) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (user) {
            throw new common_1.ConflictException(`이메일이 이미 가입되어 있습니다.`);
        }
        return false;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map
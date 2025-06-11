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
exports.FeatureUsageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const featureUsage_entity_1 = require("./entities/featureUsage.entity");
const typeorm_2 = require("typeorm");
let FeatureUsageService = class FeatureUsageService {
    constructor(featureUsageRepository) {
        this.featureUsageRepository = featureUsageRepository;
    }
    async canUsage(input) {
        const localTime = new Date();
        const threeDay = 3 * 24 * 60 * 60 * 1000;
        console.log('제발 들어와라!');
        const findUsageReturn = await this.findUsage(input);
        if (!findUsageReturn)
            return;
        const { lastUse } = findUsageReturn;
        const difUsage = localTime.getTime() - lastUse.getTime();
        if (difUsage < threeDay) {
            const canUsage = new Date(threeDay + lastUse.getTime());
            throw new common_1.ConflictException(`${canUsage.toLocaleString()}부터 사용 가능합니다.`);
        }
        return findUsageReturn;
    }
    async saveUsage(saveFeatureUsageInput, findUsageReturn) {
        const nowTime = new Date();
        if (findUsageReturn) {
            await this.featureUsageRepository.update({ userId: saveFeatureUsageInput.userId, featureName: saveFeatureUsageInput.featureName }, { lastUse: nowTime });
        }
        else {
            await this.featureUsageRepository.insert({
                userId: saveFeatureUsageInput.userId,
                featureName: saveFeatureUsageInput.featureName,
                lastUse: nowTime,
            });
        }
    }
    async findUsage({ userId, featureName }) {
        return await this.featureUsageRepository.findOne({ where: { userId, featureName } });
    }
};
exports.FeatureUsageService = FeatureUsageService;
exports.FeatureUsageService = FeatureUsageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(featureUsage_entity_1.FeatureUsage)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FeatureUsageService);
//# sourceMappingURL=featureUsage.service.js.map
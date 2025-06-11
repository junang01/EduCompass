"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureUsageModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const featureUsage_entity_1 = require("./entities/featureUsage.entity");
const user_entity_1 = require("../users/entities/user.entity");
const featureUsage_service_1 = require("./featureUsage.service");
let FeatureUsageModule = class FeatureUsageModule {
};
exports.FeatureUsageModule = FeatureUsageModule;
exports.FeatureUsageModule = FeatureUsageModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([featureUsage_entity_1.FeatureUsage, user_entity_1.User])],
        providers: [featureUsage_service_1.FeatureUsageService],
        exports: [featureUsage_service_1.FeatureUsageService],
    })
], FeatureUsageModule);
//# sourceMappingURL=featureUsage.module.js.map
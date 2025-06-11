"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const users_module_1 = require("../users/users.module");
const auth_service_1 = require("./auth.service");
const auth_resolver_1 = require("./auth.resolver");
const auth_token_entity_1 = require("./entities/auth-token.entity");
const email_validation_entity_1 = require("./entities/email-validation.entity");
const token_blacklist_entity_1 = require("./entities/token-blacklist.entity");
const admin_user_seed_1 = require("./seeds/admin-user.seed");
const user_entity_1 = require("../users/entities/user.entity");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([auth_token_entity_1.AuthToken, email_validation_entity_1.EmailVaildation, token_blacklist_entity_1.TokenBlacklist, user_entity_1.User]),
            passport_1.PassportModule.register({
                session: true,
                defaultStrategy: 'jwt',
            }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET') || 'secure_dev_secret',
                    signOptions: { expiresIn: '1h' },
                }),
            }),
            users_module_1.UsersModule,
        ],
        providers: [auth_service_1.AuthService, auth_resolver_1.AuthResolver, jwt_strategy_1.JwtStrategy, admin_user_seed_1.AdminUserSeed],
        exports: [auth_service_1.AuthService, jwt_1.JwtModule, admin_user_seed_1.AdminUserSeed],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map
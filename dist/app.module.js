"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const graphql_1 = require("@nestjs/graphql");
const apollo_1 = require("@nestjs/apollo");
const config_1 = require("@nestjs/config");
const graphql_2 = require("@nestjs/graphql");
const users_module_1 = require("./apis/users/users.module");
const auth_module_1 = require("./apis/auth/auth.module");
const book_module_1 = require("./apis/book/book.module");
const book_rec_module_1 = require("./apis/book-rec/book-rec.module");
const study_plans_module_1 = require("./apis/study-plan/study-plans.module");
const study_status_module_1 = require("./apis/study-status/study-status.module");
const notice_module_1 = require("./apis/notice/notice.module");
const subject_module_1 = require("./apis/subject/subject.module");
const passport_1 = require("@nestjs/passport");
const schedule_1 = require("@nestjs/schedule");
const user_entity_1 = require("./apis/users/entities/user.entity");
const admin_user_seed_1 = require("./apis/auth/seeds/admin-user.seed");
const studySchedule_module_1 = require("./apis/studySchedule/studySchedule.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot({
                type: process.env.DATABASE_TYPE,
                host: process.env.DATABASE_HOST,
                port: Number(process.env.DATABASE_PORT),
                username: process.env.DATABASE_USERNAME,
                password: process.env.DATABASE_PASSWORD,
                database: process.env.DATABASE_DATABASE,
                entities: [__dirname + '/apis/**/*.entity.*'],
                synchronize: true,
                logging: true,
            }),
            graphql_1.GraphQLModule.forRoot({
                driver: apollo_1.ApolloDriver,
                autoSchemaFile: true,
                playground: true,
                introspection: true,
                context: ({ req }) => ({ req }),
                formatError: (error) => {
                    console.error(error);
                    return error;
                },
                resolvers: { DateTime: graphql_2.GraphQLISODateTime },
            }),
            passport_1.PassportModule.register({ session: true }),
            schedule_1.ScheduleModule.forRoot(),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            book_module_1.BookModule,
            book_rec_module_1.BookRecommendationModule,
            study_plans_module_1.StudyPlanModule,
            study_status_module_1.StudyStatusModule,
            notice_module_1.NoticeModule,
            subject_module_1.SubjectModule,
            studySchedule_module_1.StudyScheduleModule,
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
        ],
        providers: [admin_user_seed_1.AdminUserSeed],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const session = require("express-session");
const admin_user_seed_1 = require("./apis/auth/seeds/admin-user.seed");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: 'http://localhost:3000',
        credentials: true,
    });
    app.use(session({
        secret: 'secure_dev_secret',
        resave: false,
        saveUninitialized: false,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Edu Compass API')
        .setDescription('AI 기반 학습 관리 플랫폼 API')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const adminUserSeed = app.get(admin_user_seed_1.AdminUserSeed);
    await adminUserSeed.seed();
    const port = 4000;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map
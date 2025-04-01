import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { AdminUserSeed } from './apis/auth/seeds/admin-user.seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(
    session({
      secret: 'secure_dev_secret',
      resave: false,
      saveUninitialized: false,
    }),
  );
  
  const config = new DocumentBuilder()
    .setTitle('Edu Compass API')
    .setDescription('AI 기반 학습 관리 플랫폼 API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app as any, config);
  SwaggerModule.setup('api', app as any, document);
  
  // 관리자 계정 시드 실행
  const adminUserSeed = app.get(AdminUserSeed);
  await adminUserSeed.seed();
  
  const port = 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();

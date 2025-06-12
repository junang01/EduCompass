import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { AdminUserSeed } from './apis/auth/seeds/admin-user.seed';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.use(
    session({
      secret: 'secure_dev_secret',
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.useGlobalPipes(new ValidationPipe());

  // ✅ 서버 실행 추가
  const port = 4000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();

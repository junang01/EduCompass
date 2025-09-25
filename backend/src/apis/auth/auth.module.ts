// src/apis/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { AuthToken } from './entities/auth-token.entity';
import { EmailVaildation } from './entities/email-validation.entity';
import { TokenBlacklist } from './entities/token-blacklist.entity';
import { AdminUserSeed } from './seeds/admin-user.seed';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthToken, EmailVaildation, TokenBlacklist, User]),
    PassportModule.register({
      session: true,
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'secure_dev_secret',
        signOptions: { expiresIn: '1h' },
      }),
    }),
    UsersModule,
  ],
  providers: [AuthService, AuthResolver, JwtStrategy, AdminUserSeed],
  exports: [AuthService, JwtModule, AdminUserSeed],
})
export class AuthModule {}

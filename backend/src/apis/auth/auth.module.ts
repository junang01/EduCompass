import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { TokenBlacklist } from './entities/token-blacklist.entity'; // 토큰 블랙리스트 엔티티 추가
import { AuthToken } from './entities/auth-token.entity';
import { EmailVaildation } from './entities/email-validation.entity';
import { TokenBlacklistService } from './interfaces/token-blacklist.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthToken, EmailVaildation, TokenBlacklist]),
    PassportModule.register({
      session: true,
      defaultStrategy: 'jwt'
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
  providers: [AuthService,AuthResolver,JwtStrategy,TokenBlacklistService,JwtAuthGuard],
exports: [AuthService, JwtModule, TokenBlacklistService],
})
export class AuthModule {}
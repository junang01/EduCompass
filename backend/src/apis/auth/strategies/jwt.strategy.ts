// src/apis/auth/strategies/jwt.strategy.ts
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'secure_dev_secret',
    });
    console.log('JwtStrategy 초기화됨');
    console.log('JWT_SECRET:', configService.get('JWT_SECRET') || 'secure_dev_secret');
  }

  async validate(payload: any) {
    console.log('JwtStrategy.validate 호출됨');
    console.log('JWT 페이로드:', payload);
    
    try {
      const user = await this.usersService.findOne(payload.sub);
      console.log('조회된 사용자:', user);
      
      if (!user) {
        throw new UnauthorizedException('사용자를 찾을 수 없습니다');
      }
      
      return user;
    } catch (error) {
      console.error('JWT 검증 중 오류:', error.message);
      throw new UnauthorizedException('인증에 실패했습니다');
    }
  }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}

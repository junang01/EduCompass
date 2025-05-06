// src/apis/auth/guards/jwt-auth.guard.ts
import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    this.logger.debug('JwtAuthGuard.canActivate 호출됨');
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    
    this.logger.debug(`Authorization 헤더: ${request.headers.authorization}`);
    
    // 기본 검증 로직 실행
    return super.canActivate(context);
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  handleRequest(err, user, info) {
    this.logger.debug(`handleRequest 호출됨: user=${JSON.stringify(user)}, err=${err}`);
    
    if (err || !user) {
      this.logger.error(`인증 실패: ${err?.message || '사용자 정보 없음'}`);
      throw err || new Error('Unauthorized');
    }
    return user;
  }
}

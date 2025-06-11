// src/apis/auth/guards/jwt-auth.guard.ts
import { Injectable, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private readonly authService: AuthService) {
    super();
  }

  getRequest(context: ExecutionContext) {
    if (context.getType() === 'http') {
      return context.switchToHttp().getRequest();
    } else {
      const ctx = GqlExecutionContext.create(context);
      return ctx.getContext().req;
    }
  }

  // 블랙리스트 체크는 반드시 여기서!
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const can = await super.canActivate(context);
    if (!can) return false;

    const req = this.getRequest(context);
    const token = this.extractTokenFromHeader(req);

    if (!token) throw new UnauthorizedException('토큰이 없습니다');

    if (this.authService) {
      const isBlacklisted = await this.authService.isTokenBlacklisted(token);
      this.logger.debug(`블랙리스트 여부: ${isBlacklisted}`);
      if (isBlacklisted) {
        this.logger.warn('블랙리스트 토큰 접근 시도!');
        throw new UnauthorizedException('이미 로그아웃된 토큰입니다');
      }
    }

    return true;
  }

  // 동기 함수! user만 검증
  handleRequest(err: any, user: any, info: any) {
    this.logger.debug(`handleRequest - user: ${JSON.stringify(user)}, err: ${err}`);
    if (err || !user) {
      this.logger.error(`인증 실패: ${err?.message || '사용자 정보 없음'}`);
      throw err || new UnauthorizedException('인증에 실패했습니다');
    }
    return user;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    if (!request || !request.headers) {
      this.logger.error('요청 객체 또는 헤더가 없습니다');
      return undefined;
    }
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return undefined;
    }
    return authHeader.substring(7);
  }
}

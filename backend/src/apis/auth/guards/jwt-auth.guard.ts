// src/apis/auth/guards/jwt-auth.guard.ts
import { Injectable, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { TokenBlacklistService } from '../interfaces/token-blacklist.service';

/**
 * JWT 인증을 처리하는 가드
 * GraphQL 요청에서 JWT 토큰을 검증하고 블랙리스트 확인
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private readonly tokenBlacklistService: TokenBlacklistService) {
    super();
    this.logger.debug(`TokenBlacklistService 주입 상태: ${!!this.tokenBlacklistService}`);
  }

  /**
   * 인증 활성화 여부 확인
   * @param context 실행 컨텍스트
   * @returns 인증 성공 여부
   */
  canActivate(context: ExecutionContext) {
    this.logger.debug('JwtAuthGuard.canActivate 호출됨');
    // 기본 검증 로직 실행
    return super.canActivate(context);
  }

  /**
   * GraphQL 컨텍스트에서 요청 객체 추출
   * @param context 실행 컨텍스트
   * @returns HTTP 요청 객체
   */
  getRequest(context: ExecutionContext) {
    // 컨텍스트 타입 확인
    if (context.getType() === 'http') {
      // REST API 요청인 경우
      return context.switchToHttp().getRequest();
    } else {
      // GraphQL 요청인 경우
      const ctx = GqlExecutionContext.create(context);
      const request = ctx.getContext().req;
      this.logger.debug(`GraphQL 요청 컨텍스트: ${JSON.stringify(request?.headers || {})}`);
      return request;
    }
  }

  /**
   * 인증 결과 처리 및 블랙리스트 확인
   * @param err 오류 객체
   * @param user 인증된 사용자
   * @param info 추가 정보
   * @param context 실행 컨텍스트
   * @returns 인증된 사용자 객체
   */
  handleRequest(err, user, info, context) {
    this.logger.debug(`handleRequest 호출됨: user=${JSON.stringify(user)}, err=${err}`);
    
    if (err || !user) {
      this.logger.error(`인증 실패: ${err?.message || '사용자 정보 없음'}`);
      throw err || new UnauthorizedException('인증에 실패했습니다');
    }
  
    // 컨텍스트가 있고 tokenBlacklistService가 정의되어 있는 경우에만 블랙리스트 확인
    if (context && this.tokenBlacklistService) {
      const req = this.getRequest(context);
      const token = this.extractTokenFromHeader(req);
  
      // 토큰이 블랙리스트에 있는지 확인
      if (token && this.tokenBlacklistService.isBlacklisted(token)) {
        throw new UnauthorizedException('이미 로그아웃된 토큰입니다');
      }
    } else {
      this.logger.warn('tokenBlacklistService가 정의되지 않았거나 컨텍스트가 없습니다');
    }
  
    return user;
  }

  /**
   * 요청 헤더에서 토큰 추출
   * @param request HTTP 요청 객체
   * @returns Bearer 토큰 문자열 또는 undefined
   */
  private extractTokenFromHeader(request): string | undefined {
    // 요청 객체가 없는 경우 처리
    if (!request || !request.headers) {
      this.logger.error('요청 객체 또는 헤더가 없습니다');
      return undefined;
    }

    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return undefined;
    }
    return authHeader.substring(7); // 'Bearer ' 제거
  }
}

// src/apis/auth/strategies/jwt.strategy.ts
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * JWT 인증 전략 구현 클래스
 * Passport JWT 전략을 확장하여 토큰 검증 및 사용자 인증 처리
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * JWT 전략 생성자
   * @param configService 환경 설정 서비스 - JWT 시크릿 키 접근용
   * @param usersService 사용자 서비스 - 사용자 정보 조회용
   */
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      // HTTP 요청 헤더의 Authorization: Bearer {token} 형식에서 토큰 추출
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 만료된 토큰 거부 (false: 만료 검사 활성화)
      ignoreExpiration: false,
      // JWT 서명 검증에 사용할 시크릿 키
      secretOrKey: configService.get('JWT_SECRET') || 'secure_dev_secret',
    });
    console.log('JwtStrategy 초기화됨');
    console.log('JWT_SECRET:', configService.get('JWT_SECRET') || 'secure_dev_secret');
  }

  /**
   * JWT 페이로드 검증 및 사용자 정보 조회
   * 토큰이 유효한 경우 호출되며, 페이로드에서 사용자 ID를 추출하여 사용자 정보 반환
   * @param payload JWT 토큰에서 디코딩된 페이로드
   * @returns 인증된 사용자 객체
   */
  async validate(payload: any) {
    console.log('JwtStrategy.validate 호출됨');
    console.log('JWT 페이로드:', payload);
    
    try {
      // 페이로드의 sub(subject) 필드에서 사용자 ID 추출하여 사용자 정보 조회
      const user = await this.usersService.findOne(payload.sub);
      console.log('조회된 사용자:', user);
      
      // 사용자가 존재하지 않는 경우 인증 실패 처리
      if (!user) {
        throw new UnauthorizedException('사용자를 찾을 수 없습니다');
      }
      
      // 인증 성공 시 사용자 정보 반환 (요청 객체의 user 속성에 할당됨)
      return user;
    } catch (error) {
      console.error('JWT 검증 중 오류:', error.message);
      throw new UnauthorizedException('인증에 실패했습니다');
    }
  }
}

/**
 * GraphQL 요청에서 JWT 인증을 처리하는 가드
 * AuthGuard('jwt')를 확장하여 GraphQL 컨텍스트에서 요청 객체 추출
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * GraphQL 컨텍스트에서 HTTP 요청 객체 추출
   * @param context 실행 컨텍스트
   * @returns HTTP 요청 객체
   */
  getRequest(context: ExecutionContext) {
    // GraphQL 컨텍스트 생성
    const ctx = GqlExecutionContext.create(context);
    // GraphQL 컨텍스트에서 HTTP 요청 객체 추출
    return ctx.getContext().req;
  }
}

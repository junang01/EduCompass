// src/apis/auth/auth.resolver.ts
import { Resolver, Mutation, Args, Context, Query, ObjectType, Field } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { AuthPayload } from './entities/auth.payload';
import { UnauthorizedException, UseGuards, Logger } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TokenBlacklistService } from './interfaces/token-blacklist.service';
import { TokenInfo } from './entities/token-info.entity';
import { JwtService } from '@nestjs/jwt';

@ObjectType()
export class AuthStatus {
  @Field()
  isAuthenticated: boolean;
  
  @Field()
  message: string;
  
  @Field()
  tokenStatus: string;
  
  @Field({ nullable: true })
  expiresIn?: number;
}

/**
 * 인증 관련 GraphQL 리졸버
 * 로그인, 로그아웃, 이메일 인증 등 인증 관련 기능 처리
 */
@Resolver()
export class AuthResolver {
  private readonly logger = new Logger(AuthResolver.name);

  constructor(
    private readonly authService: AuthService,
    private readonly tokenBlacklistService: TokenBlacklistService,
    private readonly jwtService: JwtService
  ) {}

  /**
   * 토큰 정보 조회
   * @param token JWT 토큰
   * @returns 토큰 정보 (주체, 발행일, 만료일, 만료 여부, 블랙리스트 여부)
   */
  @Query(() => TokenInfo)
  async tokenInfo(@Args('token') token: string) {
    const decoded = this.jwtService.decode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    
    return {
      subject: decoded.sub,
      issuedAt: new Date(decoded.iat * 1000),
      expiresAt: new Date(decoded.exp * 1000),
      isExpired: decoded.exp < currentTime,
      isBlacklisted: await this.tokenBlacklistService.isBlacklisted(token)
    };
  }

  /**
   * 토큰 만료 여부 확인
   * @param context GraphQL 컨텍스트 (요청 정보 포함)
   * @returns 토큰 만료 여부
   */
  @Query(() => Boolean)
  async isTokenExpired(@Context() context) {
    const authHeader = context.req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return true; // 토큰이 없으면 만료된 것으로 간주
    }
    
    const token = authHeader.substring(7);
    try {
      // 토큰 디코딩 및 만료 시간 확인
      const decoded = this.jwtService.decode(token);
      if (!decoded || !decoded.exp) {
        return true;
      }
      
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      return true; // 디코딩 오류 시 만료된 것으로 간주
    }
  }

  /**
   * 현재 인증 상태 확인
   * 액세스 토큰 유효성 및 만료 여부 확인
   * @param context GraphQL 컨텍스트 (요청 정보 포함)
   * @returns 인증 상태 정보
   */
  @Query(() => AuthStatus)
  async checkAuthStatus(@Context() context) {
    const authHeader = context.req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { 
        isAuthenticated: false, 
        message: '인증 토큰이 없습니다',
        tokenStatus: 'MISSING'
      };
    }
    
    const token = authHeader.substring(7);
    try {
      // 토큰 검증
      const decoded = this.jwtService.verify(token);
      
      // 블랙리스트 확인
      const isBlacklisted = await this.tokenBlacklistService.isBlacklisted(token);
      if (isBlacklisted) {
        return { 
          isAuthenticated: false, 
          message: '로그아웃된 토큰입니다',
          tokenStatus: 'BLACKLISTED'
        };
      }
      
      // 만료 시간 확인
      const currentTime = Math.floor(Date.now() / 1000);
      const timeToExpire = decoded.exp - currentTime;
      
      // 만료 5분 전인지 확인
      if (timeToExpire < 300 && timeToExpire > 0) {
        return { 
          isAuthenticated: true, 
          message: '토큰이 곧 만료됩니다',
          tokenStatus: 'EXPIRING_SOON',
          expiresIn: timeToExpire
        };
      }
      
      return { 
        isAuthenticated: true, 
        message: '인증 상태가 유효합니다',
        tokenStatus: 'VALID',
        expiresIn: timeToExpire
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return { 
          isAuthenticated: false, 
          message: '인증 토큰이 만료되었습니다',
          tokenStatus: 'EXPIRED'
        };
      }
      
      return { 
        isAuthenticated: false, 
        message: '유효하지 않은 토큰입니다',
        tokenStatus: 'INVALID'
      };
    }
  }

  /**
   * 사용자 로그인 처리
   * @param input 로그인 입력 데이터 (이메일, 비밀번호)
   * @returns 인증 토큰과 사용자 정보
   */
  @Mutation(() => AuthPayload)
  async login(@Args('input') input: LoginInput) {
    const user = await this.authService.validateUser(input.email, input.password);
    
    if (!user) {
      throw new UnauthorizedException('유효하지 않은 인증 정보입니다');
    }
    
    return this.authService.login(user);
  }

  /**
   * 사용자 로그아웃 처리
   * 현재 사용 중인 토큰을 블랙리스트에 추가
   * @param context GraphQL 컨텍스트 (요청 정보 포함)
   * @returns 로그아웃 성공 여부
   */
  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async logout(@Context() context) {
    try {
      // 요청 헤더에서 토큰 추출
      const authHeader = context.req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        // 토큰을 블랙리스트에 추가
        this.tokenBlacklistService.blacklistToken(token);
        this.logger.debug('토큰이 블랙리스트에 추가되었습니다');
      }
      return true;
    } catch (error) {
      this.logger.error('로그아웃 처리 중 오류:', error);
      return false;
    }
  }
  
  /**
   * 이메일 인증 토큰 발송
   * @param email 인증 토큰을 받을 이메일 주소
   * @returns 처리 결과 메시지
   */
  @Mutation(() => String)
  async sendAuthEmail(@Args('email') email: string): Promise<string> {
    return this.authService.sendAuthTokenEmail(email);
  }

  /**
   * 인증 토큰 확인
   * @param inputToken 사용자가 입력한 인증 토큰
   * @param email 인증 이메일 주소
   * @returns 처리 결과 메시지
   */
  @Mutation(() => String)
  async checkToken(
    @Args('inputToken') inputToken: string,
    @Args('email') email: string,
  ): Promise<string> {
    return this.authService.checkToken({ inputToken, email });
  }

  /**
   * 관리자 로그인 처리
   * @param input 로그인 입력 데이터 (이메일, 비밀번호)
   * @returns 인증 토큰과 관리자 정보
   */
  @Mutation(() => AuthPayload)
  async adminLogin(@Args('input') input: LoginInput) {
    const user = await this.authService.validateAdminUser(input.email, input.password);
    
    if (!user) {
      throw new UnauthorizedException('관리자 인증에 실패했습니다');
    }
    
    return this.authService.login(user);
  }

  /**
   * 토큰 재발급 처리
   * 리프레시 토큰을 사용하여 새 액세스 토큰 발급
   * @param refreshToken 리프레시 토큰
   * @returns 새로운 액세스 토큰과 사용자 정보
   */
  @Mutation(() => AuthPayload)
  async refreshToken(@Args('refreshToken') refreshToken: string) {
    try {
      // 리프레시 토큰 검증 및 새 액세스 토큰 발급
      return this.authService.refreshAccessToken(refreshToken);
    } catch (error) {
      this.logger.error('토큰 갱신 실패:', error);
      throw new UnauthorizedException('토큰 갱신에 실패했습니다');
    }
  }
}

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenBlacklistService {
  // 블랙리스트 토큰 저장용 Map (키: 토큰, 값: 만료 시간)
  private readonly blacklistedTokens: Map<string, number> = new Map();

  constructor(private readonly jwtService: JwtService) {
    // 주기적으로 만료된 토큰 정리 (5분마다)
    setInterval(() => this.removeExpiredTokens(), 5 * 60 * 1000);
  }

  /**
   * 토큰을 블랙리스트에 추가
   */
  blacklistToken(token: string): void {
    try {
      // 토큰 디코딩
      const decoded = this.jwtService.decode(token);
      
      if (decoded && decoded['exp']) {
        // 토큰과 만료 시간을 블랙리스트에 저장
        this.blacklistedTokens.set(token, decoded['exp']);
        console.log('토큰이 블랙리스트에 추가되었습니다.');
      }
    } catch (error) {
      console.error('토큰 블랙리스트 추가 중 오류:', error);
    }
  }

  /**
   * 토큰이 블랙리스트에 있는지 확인
   */
  isBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }

  /**
   * 만료된 토큰 제거
   */
  private removeExpiredTokens(): void {
    const now = Math.floor(Date.now() / 1000);
    
    for (const [token, expiry] of this.blacklistedTokens.entries()) {
      if (expiry < now) {
        this.blacklistedTokens.delete(token);
      }
    }
    
    console.log(`만료된 토큰 정리 완료. 현재 블랙리스트 크기: ${this.blacklistedTokens.size}`);
  }
}
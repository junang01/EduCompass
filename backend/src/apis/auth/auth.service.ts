// src/apis/auth/auth.service.ts
import { Injectable, InternalServerErrorException,UnauthorizedException  } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { EmailVaildation } from './entities/email-validation.entity';
import { IAuthCheckToken, IAuthGetToken, IAuthSendTemplateToEmail } from './interfaces/auth-getToken.interface';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';

/**
 * 비밀번호를 제외한 사용자 정보 타입
 */
export type SanitizedUser = Omit<User, 'password'>;

/**
 * 인증 관련 서비스
 * 사용자 인증, 로그인, 이메일 인증 등의 기능을 처리
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(EmailVaildation)
    private readonly emailValidationRepository: Repository<EmailVaildation>,
  ) {}

  /**
   * 사용자 이메일과 비밀번호를 검증
   * @param email 사용자 이메일
   * @param password 사용자 비밀번호
   * @returns 비밀번호를 제외한 사용자 정보 또는 null
   */
  async validateUser(email: string, password: string): Promise<SanitizedUser | null> {
    const user = await this.usersService.findByEmail(email);
    
    if (user && await bcrypt.compare(password, user.password)) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * 사용자 로그인 처리 및 JWT 토큰 발급
   * @param user 인증된 사용자 정보
   * @returns JWT 토큰과 사용자 기본 정보
   */
  async login(user: SanitizedUser) {
    const payload = { email: user.email, sub: user.id };
    
    // 액세스 토큰 생성 (짧은 유효기간)
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m' // 15분
    });
    
    // 리프레시 토큰 생성 (긴 유효기간)
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d', // 7일
      secret: this.configService.get('JWT_REFRESH_SECRET')
    });
    
    return {
      accessToken,
      refreshToken, // 리프레시 토큰 추가
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  }
  

  /**
   * 로그아웃 처리
   * @returns 로그아웃 성공 여부
   */
  async logout() {
    return true;
  }

  /**
   * 6자리 인증 토큰 생성 및 만료 시간 설정
   * @returns 생성된 토큰과 만료 시간
   */
  getToken(): IAuthGetToken {
    // 6자리 랜덤 숫자 생성 (000000 ~ 999999)
    const token = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
    // 현재 시간 + 3분(180,000ms)으로 만료 시간 설정
    const expiry = Date.now() + 3 * 60 * 1000;
    return { token, expiry };
  }

  /**
   * 이메일 인증 템플릿 생성
   * @param token 인증 토큰
   * @returns HTML 형식의 이메일 템플릿
   */
  makeTemplate(token: string): string {
    return `
        <html>
            <body>
            <div style ="display:flex; flex-direction: column; align-items: center;">
              <div style ="width: 500px;">
                <h1> Edu Compass입니다.</h1>
                <div style =" margin-top: 30px;"><span>회원님의 인증번호는</span> <h2 style = "color:red;">${token}</h2></div>
                <hr/>
                <h4>인증번호를 확인하시고 회원가입을 마무리하세욤</h4>
              </div>
            </div>
            </body>
        </html>
        `;
  }

  /**
   * 인증 이메일 발송 처리
   * @param email 수신자 이메일
   * @returns 이메일 발송 결과 메시지
   */
  async sendAuthTokenEmail(email: string): Promise<string> {
    // 이메일 중복 확인
    this.usersService.isEmailTaken(email);
    // 인증 토큰 생성
    const { token, expiry } = this.getToken();
    // 생성된 토큰 정보 저장
    await this.emailValidationRepository.save({
      email,
      token,
      expiry,
    });
    // 이메일 템플릿 생성
    const template = this.makeTemplate(token);

    // 이메일 발송
    await this.sendTemplateToEmail({ email, template });

    return '이메일 발송이 완료되었습니다.';
  }

  /**
   * 이메일 발송 처리
   * @param param0 이메일 주소와 HTML 템플릿
   * @returns 이메일 발송 결과
   */
  async sendTemplateToEmail({
    email,
    template,
  }: IAuthSendTemplateToEmail): Promise<SentMessageInfo> {
    // 환경 변수에서 이메일 발신자 정보 가져오기
    const EMAIL_SENDER = process.env.EMAIL_SENDER;
    const EMAIL_PASS = process.env.EMAIL_PASS;

    // Nodemailer 트랜스포터 설정
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_SENDER,
        pass: EMAIL_PASS,
      },
    });
    
    // 이메일 옵션 설정
    const mailOptions = {
      from: EMAIL_SENDER,
      to: email,
      subject: 'Edu Compass 이메일 인증',
      html: template,
    };
    
    try {
      // 이메일 발송
      const emailRes = await transporter.sendMail(mailOptions);
      return emailRes;
    } catch (error) {
      throw new InternalServerErrorException('이메일 전송에 실패했습니다');
    }
  }

  /**
   * 인증 토큰 검증
   * @param param0 이메일과 사용자가 입력한 토큰
   * @returns 인증 결과 메시지
   */
  async checkToken({ email, inputToken }: IAuthCheckToken): Promise<string> {
    // 이메일로 저장된 인증 정보 조회
    const result = await this.emailValidationRepository.findOne({
      where: { email },
    });
  
    if (!result) {
      return '인증 정보를 찾을 수 없습니다.';
    }
  
    const currentTime = Date.now();
    
    // 디버깅을 위한 로그 추가
    console.log('입력된 토큰:', inputToken);
    console.log('저장된 토큰:', result.token);
    console.log('현재 시간:', currentTime);
    console.log('만료 시간:', result.expiry);
    console.log('만료 시간(변환):', BigInt(result.expiry).toString());
  
    // bigint 타입을 문자열로 변환 후 숫자로 비교
    const expiryTime = Number(BigInt(result.expiry).toString());
    
    // 토큰 일치 여부와 만료 시간 검증
    if (result.token === inputToken && expiryTime > currentTime) {
      return '인증이 완료되었습니다.';
    } else {
      // 실패 원인 디버깅
      if (result.token !== inputToken) {
        console.log('토큰 불일치');
      }
      if (expiryTime <= currentTime) {
        console.log('토큰 만료됨');
      }
      return '인증에 실패했습니다.';
    }
  }

  /**
   * 만료된 인증 토큰 정리
   * @returns void
   */
  async cleanupExpiredTokens(): Promise<void> {
    const currentTime = Date.now();
    
    try {
      // 만료된 토큰 삭제
      await this.emailValidationRepository.delete({
        expiry: LessThan(currentTime)
      });
      
      console.log('만료된 인증 토큰이 성공적으로 정리되었습니다.');
    } catch (error) {
      console.error('토큰 정리 중 오류 발생:', error);
      throw new InternalServerErrorException('토큰 정리에 실패했습니다');
    }
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      // 리프레시 토큰 검증
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET')
      });
      
      // 사용자 정보 조회
      const user = await this.usersService.findOne(payload.sub);
      
      if (!user) {
        throw new UnauthorizedException('사용자를 찾을 수 없습니다');
      }
      
      // 새 액세스 토큰 발급
      const newPayload = { email: user.email, sub: user.id };
      return {
        accessToken: this.jwtService.sign(newPayload),
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      };
    } catch (error) {
      throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다');
    }
  }
  

  /**
   * 매일 자정에 실행되는 만료 토큰 정리 작업
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleTokenCleanup() {
    await this.cleanupExpiredTokens();
  }
  
  /**
   * 관리자 사용자 인증
   * @param email 관리자 이메일
   * @param password 관리자 비밀번호
   * @returns 비밀번호를 제외한 관리자 정보 또는 null
   */
  async validateAdminUser(email: string, password: string): Promise<SanitizedUser | null> {
    const user = await this.usersService.findByEmail(email);
    
    // 비밀번호 일치 및 관리자 권한 확인
    if (user && await bcrypt.compare(password, user.password) && user.role === 'ADMIN') {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }
}

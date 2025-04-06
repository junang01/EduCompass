import { 
  Injectable, 
  InternalServerErrorException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { EmailVaildation } from './entities/email-validation.entity';
import {
  IAuthCheckToken,
  IAuthGetToken,
  IAuthSendTemplateToEmail,
} from './interfaces/auth-getToken.interface';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer';
import { Cron, CronExpression } from '@nestjs/schedule';

export type SanitizedUser = Omit<User, 'password'>;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(EmailVaildation)
    private readonly emailValidationRepository: Repository<EmailVaildation>,
  ) {}

  async validateUser(email: string, password: string): Promise<SanitizedUser | null> {
    const user = await this.usersService.findByEmail(email);
    
    if (user && await bcrypt.compare(password, user.password)) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: SanitizedUser) {
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  }

  async logout() {
    return true;
  }

  getToken(): IAuthGetToken {
    const token = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
    const expiry = Date.now() + 3 * 60 * 1000;
    return { token, expiry };
  }

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

  async sendAuthTokenEmail(email: string): Promise<string> {
    this.usersService.isEmailTaken(email);
    const { token, expiry } = this.getToken();
    await this.emailValidationRepository.save({
      email,
      token,
      expiry,
    });
    const template = this.makeTemplate(token);

    await this.sendTemplateToEmail({ email, template });

    return '이메일 발송이 완료되었습니다.';
  }

  async sendTemplateToEmail({
    email,
    template,
  }: IAuthSendTemplateToEmail): Promise<SentMessageInfo> {
    const EMAIL_SENDER = process.env.EMAIL_SENDER;
    const EMAIL_PASS = process.env.EMAIL_PASS;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_SENDER,
        pass: EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: EMAIL_SENDER,
      to: email,
      subject: 'Edu Compass 이메일 인증',
      html: template,
    };
    try {
      const emailRes = await transporter.sendMail(mailOptions);
      return emailRes;
    } catch (error) {
      throw new InternalServerErrorException('이메일 전송 실패');
    }
  }

  async checkToken({ email, inputToken }: IAuthCheckToken): Promise<string> {
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
    
    if (result.token === inputToken && expiryTime > currentTime) {
      return '인증 완료되었습니다.';
    } else {
      // 실패 원인 디버깅
      if (result.token !== inputToken) {
        console.log('토큰 불일치');
      }
      if (expiryTime <= currentTime) {
        console.log('토큰 만료됨');
      }
      return '인증 실패했습니다.';
    }
  }

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
      throw new InternalServerErrorException('토큰 정리 실패');
    }
  }

  // 매일 자정에 실행되는 스케줄링된 작업
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleTokenCleanup() {
    await this.cleanupExpiredTokens();
  }
  
  async validateAdminUser(email: string, password: string): Promise<SanitizedUser | null> {
    const user = await this.usersService.findByEmail(email);
    
    if (user && await bcrypt.compare(password, user.password) && user.role === 'ADMIN') {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }
}

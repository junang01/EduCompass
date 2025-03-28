import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notice } from './entities/notice.entity';
import { INotice, INoticeService } from './interfaces/notice.interface';
import * as nodemailer from 'nodemailer';

interface EmailData {
  parentEmail: string;
  reportContent: string;
  userId: number;
}

@Injectable()
export class NoticeService implements INoticeService {
  constructor(
    @InjectRepository(Notice)
    private readonly noticeRepository: Repository<Notice>,
  ) {}

  async findAll(userId: number, args?: any): Promise<Notice[]> {
    const query = this.noticeRepository.createQueryBuilder('notice')
      .where('notice.userId = :userId', { userId });

    if (args?.receiverEmail) {
      query.andWhere('notice.receiverEmail = :receiverEmail', { receiverEmail: args.receiverEmail });
    }

    return query.getMany();
  }

  async findOne(id: number, userId: number): Promise<Notice> {
    const notice = await this.noticeRepository.findOne({ where: { id } });
    
    if (!notice) {
      throw new NotFoundException(`Notice with ID ${id} not found`);
    }
    
    if (notice.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this notice');
    }
    
    return notice;
  }

  async create(notice: INotice): Promise<Notice> {
    const newNotice = this.noticeRepository.create(notice);
    await this.sendEmailToParent({
      parentEmail: notice.receiverEmail,
      reportContent: notice.message,
      userId: notice.userId
    });
    return this.noticeRepository.save(newNotice);
  }

  async update(id: number, noticeData: Partial<INotice>, userId: number): Promise<Notice> {
    const notice = await this.findOne(id, userId);
    Object.assign(notice, noticeData);
    return this.noticeRepository.save(notice);
  }

  async delete(id: number, userId: number): Promise<boolean> {
    await this.findOne(id, userId);
    const result = await this.noticeRepository.delete(id);
    return result.affected > 0;
  }

  async sendEmailToParent(data: EmailData): Promise<any> {
    try {
      
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER || 'sksmsdiqkrtjsdn@gmail.com',
          
          pass: process.env.EMAIL_PASS || 'gtjm ptgu sada jdcd',
        },
      });
  
      
      await transporter.verify();
      console.log('SMTP 서버 연결 성공');
  
      const mailOptions = {
        from: process.env.EMAIL_USER || 'sksmsdiqkrtjsdn@gmail.com',
        to: data.parentEmail,
        subject: '학습 현황 보고',
        text: data.reportContent,
      };
  

      const info = await transporter.sendMail(mailOptions);
      console.log('이메일 전송 성공:', info.messageId);
      return { message: '이메일 전송 성공', info };
    } catch (error) {
      console.error('이메일 전송 실패:', error);
      
      if (error.code === 'EAUTH') {
        throw new Error('이메일 인증 실패: 사용자 이름과 비밀번호를 확인하세요');
      } else if (error.code === 'ESOCKET') {
        throw new Error('SMTP 서버 연결 실패: 호스트 및 포트 설정을 확인하세요');
      }
      throw new Error(`이메일 전송 실패: ${error.message}`);
    }
  }
  
}

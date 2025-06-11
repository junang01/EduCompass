import { Repository } from 'typeorm';
import { Notification } from './entities/notice.entity';
import { INotice, INoticeService } from './interfaces/notice.interface';
interface EmailData {
    parentEmail: string;
    reportContent: string;
    userId: number;
}
export declare class NoticeService implements INoticeService {
    private readonly noticeRepository;
    constructor(noticeRepository: Repository<Notification>);
    findAll(userId: number, args?: any): Promise<Notification[]>;
    findOne(id: number, userId: number): Promise<Notification>;
    create(notice: INotice): Promise<Notification>;
    update(id: number, noticeData: Partial<INotice>, userId: number): Promise<Notification>;
    delete(id: number, userId: number): Promise<boolean>;
    sendEmailToParent(data: EmailData): Promise<any>;
}
export {};

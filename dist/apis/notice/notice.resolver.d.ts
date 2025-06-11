import { NoticeService } from './notice.service';
import { Notification } from './entities/notice.entity';
import { CreateNoticeInput } from './dto/create-notice.input';
import { UpdateNoticeInput } from './dto/update-notice.input';
import { NoticeArgs } from './dto/notice.args';
import { User } from '../users/entities/user.entity';
import { SendEmailInput } from './dto/send-email.input';
export declare class NoticeResolver {
    private readonly noticeService;
    constructor(noticeService: NoticeService);
    notices(user: User, args: NoticeArgs): Promise<Notification[]>;
    notice(id: number, user: User): Promise<Notification>;
    createNotice(createNoticeInput: CreateNoticeInput, user: User): Promise<Notification>;
    updateNotice(updateNoticeInput: UpdateNoticeInput, user: User): Promise<Notification>;
    deleteNotice(id: number, user: User): Promise<boolean>;
    sendNotice(createNoticeInput: CreateNoticeInput, user: User): Promise<Notification>;
    sendEmailToParent(data: SendEmailInput, user: User): Promise<any>;
}

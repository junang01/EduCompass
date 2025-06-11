export interface INotice {
    id?: number;
    message: string;
    receiverEmail: string;
    userId: number;
}
export interface EmailData {
    parentEmail: string;
    reportContent: string;
    userId: number;
}
export interface INoticeService {
    findAll(userId: number, args?: any): Promise<INotice[]>;
    findOne(id: number, userId: number): Promise<INotice>;
    create(notice: INotice): Promise<INotice>;
    update(id: number, notice: Partial<INotice>, userId: number): Promise<INotice>;
    delete(id: number, userId: number): Promise<boolean>;
    sendEmailToParent(data: EmailData): Promise<any>;
}

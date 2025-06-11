export interface IAuthGetToken {
    token: string;
    expiry: number;
}
export interface IAuthSendTemplateToEmail {
    email: string;
    template: string;
}
export interface IAuthCheckToken {
    inputToken: string;
    email: string;
}

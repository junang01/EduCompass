export interface IAuth {
    user?: {
        id: string;
    };
}
export interface IContext {
    req: Request & IAuth;
    res: Response;
}

export interface IUser {
    id?: number;
    email: string;
    password: string;
    name: string;
    grade?: string;
    line?: string;
    school?: string;
    receiverEmail?: string;
  }
  
  export interface IUserService {
    findAll(): Promise<IUser[]>;
    findOne(id: number): Promise<IUser>;
    findByEmail(email: string): Promise<IUser>;
    create(user: IUser): Promise<IUser>;
    update(id: number, user: Partial<IUser>): Promise<IUser>;
    delete(id: number): Promise<boolean>;
    validateUser(email: string, password: string): Promise<any>;
  }
  
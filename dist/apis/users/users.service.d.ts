import { Repository, FindOneOptions } from 'typeorm';
import { User } from './entities/user.entity';
import { IUser, IUserService } from './interfaces/user.interface';
import { RegisterUserInput } from './dto/register-user.input';
export declare class UsersService implements IUserService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    findAll(): Promise<User[]>;
    findOne(id: number, options?: FindOneOptions<User>): Promise<User>;
    findByEmail(email: string): Promise<User>;
    create(registerUserInput: RegisterUserInput): Promise<User>;
    update(id: number, userData: Partial<IUser>): Promise<User>;
    delete(id: number): Promise<boolean>;
    validateUser(email: string, password: string): Promise<any>;
    softDeleteUser(id: number): Promise<boolean>;
    restoreUser(id: number): Promise<void>;
    findAllWithDeleted(): Promise<User[]>;
    findOnlyDeleted(): Promise<User[]>;
    findDeletedUsers(): Promise<User[]>;
    isEmailTaken(email: string): Promise<boolean>;
}

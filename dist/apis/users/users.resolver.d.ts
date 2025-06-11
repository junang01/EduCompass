import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { RegisterUserInput } from './dto/register-user.input';
export declare class UsersResolver {
    private readonly usersService;
    constructor(usersService: UsersService);
    users(): Promise<User[]>;
    user(id: number): Promise<User>;
    me(user: User): Promise<User>;
    createUser(createUserInput: CreateUserInput): Promise<User>;
    registerUser(registerUserInput: RegisterUserInput): Promise<User>;
    updateUser(id: number, updateUserInput: UpdateUserInput, user: User): Promise<User>;
    deleteUser(user: User): Promise<boolean>;
    deleteMyAccount(user: User): Promise<boolean>;
    testAuth(user: User): Promise<User>;
    findOnlyDeleted(): Promise<User[]>;
}

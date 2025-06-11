import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
export declare class AdminUserSeed {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    seed(): Promise<void>;
}

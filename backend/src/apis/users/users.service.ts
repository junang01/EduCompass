import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { IUser, IUserService } from './interfaces/user.interface';
import { RegisterUserInput } from './dto/register-user.input';

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`ID ${id}에 해당하는 사용자를 찾을 수 없습니다`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`이메일 ${email}에 해당하는 사용자를 찾을 수 없습니다`);
    }
    return user;
  }

  async create(registerUserInput: RegisterUserInput): Promise<User> {
    const existingUser = await this.userRepository.findOne({ where: { email: registerUserInput.email } });
    if (existingUser) {
      throw new ConflictException('이미 존재하는 이메일입니다');
    }

    const { password, ...userData } = registerUserInput;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
    
    return this.userRepository.save(newUser);
  }

  async update(id: number, userData: Partial<IUser>): Promise<User> {
    const user = await this.findOne(id);
    
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    
    Object.assign(user, userData);
    
    return this.userRepository.save(user);
  }

  async delete(id: number): Promise<boolean> {
    await this.softDeleteUser(id);
    return true;
  }

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.findByEmail(email);
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (isPasswordValid) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async softDeleteUser(id: number): Promise<void> {
    const result = await this.userRepository.softDelete(id);
    
    if (!result.affected) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async restoreUser(id: number): Promise<void> {
    const result = await this.userRepository.restore(id);
    
    if (!result.affected) {
      throw new NotFoundException(`Deleted user with ID ${id} not found`);
    }
  }

  async findAllWithDeleted(): Promise<User[]> {
    return this.userRepository.find({ withDeleted: true });
  }

  async findOnlyDeleted(): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.deletedAt IS NOT NULL')
      .getMany();
  }
  async isEmailTaken(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new ConflictException(`이메일이 이미 가입되어 있습니다.`);
    }
    return false; // 이메일이 없으면 false 반환
  }
}

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { IUser, IUserService } from './interfaces/user.interface';

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
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async create(userData: IUser): Promise<User> {

    const existingUser = await this.userRepository.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }


    const hashedPassword = await bcrypt.hash(userData.password, 10);
    

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
    const result = await this.userRepository.delete(id);
    return result.affected > 0;
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
}

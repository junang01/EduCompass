import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull, FindOneOptions } from 'typeorm';
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

  // ✅ 수정된 부분: options 인자 허용 및 withDeleted 대응

  async findOne(id: number, options?: FindOneOptions<User>): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      ...(options || {}),
    });

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

  async softDeleteUser(id: number): Promise<boolean> {
    try {
      console.log(`회원 탈퇴 요청: ID ${id}`);
      const result = await this.userRepository.softDelete(id);
      console.log(`softDelete 결과:`, result);
      
      if (!result.affected) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      
      // 삭제된 사용자 확인
      const deletedUser = await this.userRepository.findOne({
        where: { id },
        withDeleted: true
      });
      console.log('삭제된 사용자 정보:', deletedUser);
      
      return true;
    } catch (error) {
      console.error('회원 탈퇴 처리 중 오류:', error);
      throw new InternalServerErrorException('회원 탈퇴 처리 중 오류가 발생했습니다.');
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
    return this.userRepository.find({
      withDeleted: true,
      where: {
        deletedAt: Not(IsNull())
      }
    });
  }
  /**
 * 회원탈퇴한 사용자 목록 조회
 * @returns 회원탈퇴한 사용자 목록
 */
async findDeletedUsers(): Promise<User[]> {
  return this.userRepository.find({
    withDeleted: true,
    where: {
      deletedAt: Not(IsNull())
    }
  });
}
  async isEmailTaken(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new ConflictException(`이메일이 이미 가입되어 있습니다.`);
    }
    return false; // 이메일이 없으면 false 반환

  }
}

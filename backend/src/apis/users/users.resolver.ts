import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RegisterUserInput } from './dto/register-user.input';
import { AdminGuard } from '../auth/guards/admin.guard';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  @UseGuards(JwtAuthGuard)
  async users(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async user(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: User): Promise<User> {
    return this.usersService.findOne(user.id);
  }

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput): Promise<User> {
    return this.usersService.create(createUserInput);
  }

  @Mutation(() => User)
  async registerUser(@Args('input') registerUserInput: RegisterUserInput) {
    return this.usersService.create(registerUserInput);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser() user: User,
  ): Promise<User> {
    if (user.id !== id) {
      throw new Error('본인의 정보만 수정할 수 있습니다');
    }
    return this.usersService.update(id, updateUserInput);
  }

@Mutation(() => Boolean)
@UseGuards(JwtAuthGuard)
async deleteUser(@CurrentUser() user: User): Promise<boolean> {
  console.log('deleteUser 뮤테이션 호출됨');
  console.log('현재 인증된 사용자:', user);
  
  if (!user) {
    throw new Error('인증 정보가 없습니다. 다시 로그인해주세요.');
  }
  
  try {
    return this.usersService.softDeleteUser(user.id);
  } catch (error) {
    console.error('회원 탈퇴 처리 중 오류:', error);
    throw error;
  }
}


  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteMyAccount(@CurrentUser() user: User): Promise<boolean> {
    console.log('deleteMyAccount 뮤테이션 호출됨');
    console.log('현재 인증된 사용자:', user);
    
    if (!user || !user.id) {
      console.error('사용자 인증 정보가 없거나 ID가 없습니다:', user);
      throw new Error('인증 정보가 올바르지 않습니다. 다시 로그인해주세요.');
    }
    
    try {
      return this.usersService.delete(user.id);
    } catch (error) {
      console.error('회원 탈퇴 처리 중 오류(Resolver):', error);
      throw error;
    }
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async testAuth(@CurrentUser() user: User) {
    console.log('testAuth 쿼리 실행됨');
    console.log('인증된 사용자:', user);
    return user;
  }

  @Query(() => [User])
  @UseGuards(JwtAuthGuard, AdminGuard)
  async findOnlyDeleted(): Promise<User[]> {
    return this.usersService.findOnlyDeleted();
  }
}

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

/**
 * 사용자 관련 GraphQL 리졸버
 * 사용자 정보 조회, 생성, 수정, 삭제 등의 기능을 처리
 */
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 모든 사용자 목록 조회
   * @returns 사용자 목록
   */
  @Query(() => [User])
  @UseGuards(JwtAuthGuard)
  async users(): Promise<User[]> {
    return this.usersService.findAll();
  }

  /**
   * 특정 ID의 사용자 정보 조회
   * @param id 조회할 사용자 ID
   * @returns 사용자 정보
   */
  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async user(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  /**
   * 현재 로그인한 사용자 정보 조회
   * @param user 현재 인증된 사용자 정보
   * @returns 사용자 정보
   */
  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: User): Promise<User> {
    return this.usersService.findOne(user.id);
  }

  /**
   * 관리자용 사용자 생성 기능
   * @param createUserInput 생성할 사용자 정보
   * @returns 생성된 사용자 정보
   */
  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput): Promise<User> {
    return this.usersService.create(createUserInput);
  }

  /**
   * 회원가입 처리
   * @param registerUserInput 회원가입 정보
   * @returns 생성된 사용자 정보
   */
  @Mutation(() => User)
  async registerUser(@Args('input') registerUserInput: RegisterUserInput) {
    return this.usersService.create(registerUserInput);
  }

  /**
   * 사용자 정보 수정
   * @param id 수정할 사용자 ID
   * @param updateUserInput 수정할 정보
   * @param user 현재 인증된 사용자
   * @returns 수정된 사용자 정보
   */
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

  /**
   * 사용자 계정 소프트 삭제 (관리자용)
   * @param user 현재 인증된 사용자
   * @returns 삭제 성공 여부
   */
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

  /**
   * 사용자 본인 계정 삭제 (회원 탈퇴)
   * @param user 현재 인증된 사용자
   * @returns 삭제 성공 여부
   */
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

  /**
   * 인증 테스트용 쿼리
   * @param user 현재 인증된 사용자
   * @returns 인증된 사용자 정보
   */
  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async testAuth(@CurrentUser() user: User) {
    console.log('testAuth 쿼리 실행됨');
    console.log('인증된 사용자:', user);
    return user;
  }

  /**
   * 삭제된 사용자 목록 조회 (관리자 전용)
   * @returns 삭제된 사용자 목록
   */
  @Query(() => [User])
  @UseGuards(JwtAuthGuard, AdminGuard)
  async findOnlyDeleted(): Promise<User[]> {
    return this.usersService.findOnlyDeleted();
  }
}

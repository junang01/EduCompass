import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { AuthPayload } from './entities/auth.payload';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async login(@Args('input') input: LoginInput) {
    const user = await this.authService.validateUser(input.email, input.password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    return this.authService.login(user);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async logout() {
    // 서버 측에서는 특별한 처리 없이 성공 응답만 반환
    return true;
  }
  
  @Mutation(() => String)
  async sendAuthEmail(@Args('email') email: string): Promise<string> {
    return this.authService.sendAuthTokenEmail(email);
  }

  @Mutation(() => String)
  async checkToken(
    @Args('inputToken') inputToken: string,
    @Args('email') email: string,
  ): Promise<string> {
    return this.authService.checkToken({ inputToken, email });
  }
  @Mutation(() => AuthPayload)
async adminLogin(@Args('input') input: LoginInput) {
  const user = await this.authService.validateAdminUser(input.email, input.password);
  
  if (!user) {
    throw new UnauthorizedException('관리자 인증에 실패했습니다');
  }
  
  return this.authService.login(user);
}
}

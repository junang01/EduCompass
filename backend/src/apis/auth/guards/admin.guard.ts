import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('인증이 필요합니다');
    }

    if (user.role !== 'ADMIN') {
      throw new UnauthorizedException('관리자 권한이 필요합니다');
    }

    return true;
  }
}

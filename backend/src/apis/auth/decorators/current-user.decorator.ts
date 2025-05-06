// src/apis/auth/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    
    console.log('CurrentUser 데코레이터 호출됨');
    console.log('요청 헤더:', request.headers);
    console.log('사용자 정보:', request.user);
    
    if (!request.user) {
      console.error('사용자 정보를 찾을 수 없습니다. 인증이 필요합니다.');
    }
    
    return request.user;
  },
);

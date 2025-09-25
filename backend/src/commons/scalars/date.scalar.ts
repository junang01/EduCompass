// src/commons/scalars/date.scalar.ts
import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

// DateTime 대신 Date 스칼라만 정의
@Scalar('Date')
export class DateScalar implements CustomScalar<string, Date> {
  description = 'Date custom scalar type';

  parseValue(value: string | number): Date {
    return new Date(value);
  }

  serialize(value: Date | string): string {
    if (value instanceof Date) {
      return value.toISOString();
    }
    
    // 문자열이 들어온 경우 Date 객체로 변환 후 다시 ISO 문자열로
    try {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error(`Invalid date: ${value}`);
      }
      return date.toISOString();
    } catch (error) {
      console.error(`Error serializing date: ${value}`, error);
      throw error;
    }
  }

  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.STRING || ast.kind === Kind.INT) {
      return new Date(ast.kind === Kind.STRING ? ast.value : parseInt(ast.value, 10));
    }
    return null;
  }
}

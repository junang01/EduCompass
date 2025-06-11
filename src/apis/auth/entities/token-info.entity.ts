// src/apis/auth/entities/token-info.entity.ts
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class TokenInfo {
  @Field()
  subject: string;
  
  @Field()
  issuedAt: Date;
  
  @Field()
  expiresAt: Date;
  
  @Field()
  isExpired: boolean;
  
  @Field()
  isBlacklisted: boolean;
}

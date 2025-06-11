import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthStatus {
  @Field()
  isAuthenticated: boolean;
  
  @Field()
  message: string;
  
  @Field()
  tokenStatus: string;
  
  @Field({ nullable: true })
  expiresIn?: number;
}

import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class NoticeResponse {
  @Field()
  message: string;

  @Field(() => String, { nullable: true })
  info?: string;
}

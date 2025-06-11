import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class EmailVaildation {
  @PrimaryGeneratedColumn()
  @Field(() => Number)
  id: number;

  @Column()
  @Field(() => String)
  email: string;

  @Column()
  @Field(() => String)
  token: string;

  @Column({ type: 'bigint' })
  @Field(() => Number)
  expiry: number;

}

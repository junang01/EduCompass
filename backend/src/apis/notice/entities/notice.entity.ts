import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@ObjectType()
@Entity()
export class Notification {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('text')
  message: string;

  @Field()
  @Column()
  receiverEmail: string;

  @Field(() => ID)
  @Column({ name: 'user_seq' })
  userId: number;

  @Field(() => User)
  @ManyToOne(() => User, user => user.notifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_seq' })
  user: User;

  @Field()
  @CreateDateColumn({ name: 'noti_create_date' })
  createdAt: Date;
}

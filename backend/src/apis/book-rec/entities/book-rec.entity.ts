import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Book } from '../../book/entities/book.entity';
import { Subject } from '../../subject/entities/subject.entity';

@ObjectType()
@Entity()
export class BookRecommendation {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => ID)
  @Column()
  userId: number;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Field(() => ID)
  @Column()
  bookId: number;

  @Field(() => Book)
  @ManyToOne(() => Book)
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @Field(() => ID)
  @Column()
  subject_seq: number;

  @Field(() => Subject)
  @ManyToOne(() => Subject, subject => subject.bookRecommendations)
  @JoinColumn({ name: 'subject_seq' })
  subject: Subject;

  @Field()
  @Column({ default: false })
  isFavorite: boolean;

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}

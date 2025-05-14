import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BookRecommendation } from '../../book-rec/entities/book-rec.entity';
import { Subject } from '../../subject/entities/subject.entity';

@ObjectType()
@Entity()
export class Book {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  author: string;

  @Field(() => ID)
  @Column()
  subject_seq: number;

  @Field(() => Subject)
  @ManyToOne(() => Subject)
  @JoinColumn({ name: 'subject_seq' })
  subject: Subject;

  @Field({ nullable: true })
  @Column({ nullable: true })
  publisher: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  overview: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  difficultyLevel: string;

  @Field()
  @CreateDateColumn({ name: 'book_create_date' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'book_mod_date' })
  updatedAt: Date;

  @OneToMany(() => BookRecommendation, (bookRecommendation) => bookRecommendation.book)
  bookRecommendations: BookRecommendation[];
}

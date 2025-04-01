import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { StudyPlan } from '../../study-plan/entities/study-plan.entity';
import { BookSave } from '../../bookSave/entities/booksave.entity';
import { Notification } from '../../notice/entities/notice.entity';
import { AuthToken } from '../../auth/entities/auth-token.entity';

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  school: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  grade: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  line: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  receiverEmail: string;

  @Field()
  @CreateDateColumn({ name: 'user_create_date' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'user_mod_date' })
  updatedAt: Date;

  // 소프트 딜리트를 위한 컬럼 추가
  @DeleteDateColumn()
  deletedAt: Date;

  // 관계 설정
  @OneToMany(() => StudyPlan, studyPlan => studyPlan.user)
  studyPlans: StudyPlan[];

  @OneToMany(() => BookSave, bookSave => bookSave.user)
  bookSaves: BookSave[];

  @OneToMany(() => Notification, notification => notification.user)
  notifications: Notification[];

  @OneToMany(() => AuthToken, authToken => authToken.user)
  authTokens: AuthToken[];
}

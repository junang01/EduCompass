import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@ObjectType()
@Entity()
export class Subject {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ length: 100 })
  subjectName: string;

  // @Field({ nullable: true })
  // @Column({ type: 'text', nullable: true })
  // description: string;

  // @Field()
  // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // createdAt: Date;

  // @Field()
  // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  // updatedAt: Date;

  // @OneToMany(() => Book, book => book.subject)
  // books: Book[];

  // @OneToMany(() => StudyPlan, studyPlan => studyPlan.subject)
  // studyPlans: StudyPlan[];

  // @OneToMany(() => BookRecommendation, bookRecommendation => bookRecommendation.subject)
  // bookRecommendations: BookRecommendation[];

  // @OneToMany(() => StudyStatus, studyStatus => studyStatus.subject)
  // studyStatuses: StudyStatus[];

  // 다 필요도 없는데 왜 있는지 모르겠음
}

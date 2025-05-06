import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@ObjectType()
@Entity()
@Unique(['userId', 'featureName'])
export class FeatureUsage {
  //
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Date)
  @Column()
  lastUse: Date;

  @Field(() => String)
  @Column()
  featureName: string;

  @Field(() => Number)
  @Column()
  userId: number;
}

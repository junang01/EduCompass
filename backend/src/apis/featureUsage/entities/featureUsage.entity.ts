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
  @Column({ name: 'last_use' })
  lastUse: Date;

  @Field(() => String)
  @Column({ name: 'feature_name'})
  featureName: string;

  @Field(() => Number)
  @Column({ name: 'user_id' })
  userId: number;
}

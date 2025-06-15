import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLISODateTime } from '@nestjs/graphql';
import { UsersModule } from './apis/users/users.module';
import { AuthModule } from './apis/auth/auth.module';
import { BookModule } from './apis/book/book.module';
import { BookRecommendationModule } from './apis/book-rec/book-rec.module';
import { StudyPlanModule } from './apis/study-plan/study-plans.module';
import { StudyStatusModule } from './apis/study-status/study-status.module';
import { NoticeModule } from './apis/notice/notice.module';
import { SubjectModule } from './apis/subject/subject.module';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { User } from './apis/users/entities/user.entity';
import { AdminUserSeed } from './apis/auth/seeds/admin-user.seed';
import { StudyScheduleModule } from './apis/studySchedule/studySchedule.module';
import { StudySchedule } from './apis/studySchedule/entities/studySchedule.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [
        StudySchedule,
        __dirname + '/apis/**/*.entity.*'], //entity부분을 연결하기 위해 일일이 하나씩 다 입력하는게 아니라 상위 파일주소를 입력해 순회하면서 entity로 시작하는 파일을 가져오게 한다.
      synchronize: true,
      logging: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      introspection: true,
      // 명시적으로 context에 req 객체 추가해야댐
      context: ({ req }) => ({ req }),
      formatError: (error) => {
        console.error(error);
        return error;
      },
      resolvers: { DateTime: GraphQLISODateTime },
    }),
    PassportModule.register({ session: true }),
    ScheduleModule.forRoot(),

    UsersModule,
    AuthModule,
    BookModule,
    BookRecommendationModule,
    StudyPlanModule,
    StudyStatusModule,
    NoticeModule,
    SubjectModule,
    StudyScheduleModule,
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AdminUserSeed],
})
export class AppModule {}

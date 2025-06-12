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
import { StudyScheduleModule } from './apis/studySchedule/studySchedule.module';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { User } from './apis/users/entities/user.entity';
import { AdminUserSeed } from './apis/auth/seeds/admin-user.seed';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // DB 설정
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST') || 'localhost',
        port: configService.get('DB_PORT') || 3306,
        username: configService.get('DB_USERNAME') || 'root',
        password: configService.get('DB_PASSWORD') || '1234',
        database: configService.get('DB_DATABASE') || 'new_db_edu',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
      }),
    }),

    // GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      introspection: true,
      context: ({ req }) => ({ req }),
      formatError: (error) => {
        console.error(error);
        return error;
      },
      resolvers: { DateTime: GraphQLISODateTime },
    }),

    // 세션 / 일정
    PassportModule.register({ session: true }),
    ScheduleModule.forRoot(),

    // Feature 모듈들
    UsersModule,
    AuthModule,
    BookModule,
    BookRecommendationModule,
    StudyPlanModule,
    StudyStatusModule,
    NoticeModule,
    SubjectModule,
    StudyScheduleModule,

    // User 엔티티 등록
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [], // ✅ Swagger 오류 방지를 위해 명시적 선언 (비어 있어도 필요함)
  providers: [AdminUserSeed],
})
export class AppModule {}

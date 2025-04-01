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
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

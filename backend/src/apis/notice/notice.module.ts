import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { NoticeResolver } from './notice.resolver';
import { NoticeService } from './notice.service';
import { Notification } from './entities/notice.entity';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    TypeOrmModule.forFeature([Notification]),
  ],
  providers: [NoticeResolver, NoticeService],
  exports: [NoticeService],
})
export class NoticeModule {}

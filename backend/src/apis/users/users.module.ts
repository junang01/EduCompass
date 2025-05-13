// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { AuthToken } from '../auth/entities/auth-token.entity';
import { UsersResolver } from './users.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([User, AuthToken])],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}

// src/database/seeds/admin-user.seed.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminUserSeed {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed() {
    // 이미 관리자 계정이 있는지 확인
    const existingAdmin = await this.userRepository.findOne({
      where: { email: 'admin@educompass.com' },
    });

    if (!existingAdmin) {
      // 관리자 계정 생성
      const hashedPassword = await bcrypt.hash('admin', 10);

      const adminUser = this.userRepository.create({
        email: 'admin@educompass.com',
        password: hashedPassword,
        name: '관리자',
        role: 'ADMIN',
        school: 'Edu Compass',
        grade: '관리자',
        line: '관리자',
      });

      await this.userRepository.save(adminUser);
      console.log('관리자 계정이 성공적으로 생성되었습니다.');
    } else {
      console.log('관리자 계정이 이미 존재합니다.');
    }
  }
}

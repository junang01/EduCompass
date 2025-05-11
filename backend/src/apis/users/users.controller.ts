
import { Controller, Delete, Param } from '@nestjs/common';
import { UsersService } from './users.service';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Delete(':id')

  async deleteUser(@Param('id') id: number) {
    await this.usersService.softDeleteUser(id);
    return { message: '회원탈퇴가 완료되었습니다.' };
  }
}

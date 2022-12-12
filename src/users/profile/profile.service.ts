import { BadRequestException, Injectable } from '@nestjs/common';

import * as bcrypt from 'bcryptjs';

import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly usersService: UsersService) {}

  async getProfile(user: User) {
    return this.usersService.findOne(user.id);
  }

  async updateProfile(user: User, updateUserDto: UpdateUserDto) {
    return this.usersService.update(user.id, updateUserDto);
  }

  async changePassword(user: User, changePassword: ChangePasswordDto) {
    const { oldPassword, newPassword } = changePassword;

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      throw new BadRequestException('Invalid password');
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    return { message: 'Password changed' };
  }

  async generateCode(user: User) {
    const code = Math.random().toString(36).substring(2, 10);

    const userCode = await this.usersService.findOne(user.id);

    if (userCode.code) {
      throw new BadRequestException(`User already has a code`);
    }

    await this.usersService.update(user.id, { code });

    return { code };
  }

  async deleteCode(user: User) {
    await this.usersService.update(user.id, { code: null });

    return { message: 'Code deleted' };
  }
}

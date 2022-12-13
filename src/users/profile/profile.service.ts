import { BadRequestException, Injectable } from '@nestjs/common';

import * as bcrypt from 'bcryptjs';

import { UsersService } from '../users.service';
import { MembersService } from './../../members/members.service';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

const modules = [
  {
    id: 1,
    name: 'Home',
    path: '/home',
    image: 'home.svg',
  },
  {
    id: 2,
    name: 'Mi perfil',
    path: '/profile',
    image: 'profile.svg',
  },
  {
    id: 3,
    name: 'Clan',
    path: '/clan',
    image: 'clan.svg',
  },
  {
    id: 4,
    name: 'Recompensas',
    path: '/rewards',
    image: 'rewards.svg',
  },
  {
    id: 5,
    name: 'Sorteos',
    path: '/raffles',
    image: 'raffles.svg',
  },
  {
    id: 6,
    name: 'Mensajes',
    path: '/messages',
    image: 'messages.svg',
  },
];

@Injectable()
export class ProfileService {
  constructor(
    private readonly usersService: UsersService,
    private readonly membersService: MembersService,
  ) {}

  async getProfile(user: User) {
    return this.usersService.findOne(user.id);
  }

  async getPermissions(user: User) {
    const members = await this.membersService.getDataFromClashRoyaleApi();

    const member = members.find((member) => member.tag === user.tag);

    if (member.role === 'leader') {
      return {
        modules,
      };
    } else if (member.role === 'coLeader') {
      return {
        modules: modules.filter((module) => module.id !== 5),
      };
    } else if (member.role === 'elder') {
      return {
        modules: modules.filter((module) => module.id !== 5),
      };
    } else {
      return {
        modules: modules.filter((module) => module.id !== 5),
      };
    }
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

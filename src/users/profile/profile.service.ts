import { Injectable } from '@nestjs/common';

import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly usersService: UsersService) {}

  async getProfile(user: User) {
    return this.usersService.findOne(user.id);
  }

  async updateProfile(user: User, updateUserDto: UpdateUserDto) {
    return this.usersService.update(user.id, updateUserDto);
  }
}

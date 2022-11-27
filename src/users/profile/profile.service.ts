import { Injectable } from '@nestjs/common';

import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';

@Injectable()
export class ProfileService {
  constructor(private readonly usersService: UsersService) {}

  async getProfile(user: User) {
    return this.usersService.findOne(user.id);
  }
}

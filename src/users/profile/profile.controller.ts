import { Controller, Get } from '@nestjs/common';

import { User } from '../entities/user.entity';
import { Auth, GetUser } from './../../auth/decorators';
import { ValidRoles } from './../../auth/interfaces';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Auth(
    ValidRoles.LIDER,
    ValidRoles.COLEADER,
    ValidRoles.VETERANO,
    ValidRoles.MIEMBRO,
  )
  @Get()
  getProfile(@GetUser() user: User) {
    return this.profileService.getProfile(user);
  }
}

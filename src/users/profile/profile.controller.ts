import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';

import { User } from '../entities/user.entity';
import { Auth, GetUser } from './../../auth/decorators';
import { ValidRoles } from './../../auth/interfaces';
import { ProfileService } from './profile.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

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

  @Auth(
    ValidRoles.LIDER,
    ValidRoles.COLEADER,
    ValidRoles.VETERANO,
    ValidRoles.MIEMBRO,
  )
  @Get('permissions')
  getPermissions(@GetUser() user: User) {
    return this.profileService.getPermissions(user);
  }

  @Auth(
    ValidRoles.LIDER,
    ValidRoles.COLEADER,
    ValidRoles.VETERANO,
    ValidRoles.MIEMBRO,
  )
  @Patch()
  updateProfile(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.profileService.updateProfile(user, updateUserDto);
  }

  @Patch('change-password')
  @Auth(
    ValidRoles.LIDER,
    ValidRoles.COLEADER,
    ValidRoles.VETERANO,
    ValidRoles.MIEMBRO,
  )
  changePassword(
    @GetUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.profileService.changePassword(user, changePasswordDto);
  }

  @Post('generate-code')
  @Auth(ValidRoles.LIDER, ValidRoles.COLEADER)
  generateCode(@GetUser() user: User) {
    return this.profileService.generateCode(user);
  }

  @Delete('delete-code')
  @Auth(ValidRoles.LIDER, ValidRoles.COLEADER)
  deleteCode(@GetUser() user: User) {
    return this.profileService.deleteCode(user);
  }
}

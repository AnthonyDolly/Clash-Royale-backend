import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidateMongoIdPipe } from './../common/pipes/validate-mongo-id.pipe';
import { Auth, GetUser } from '..//auth/decorators';
import { ValidRoles } from '..//auth/interfaces';
import { User } from './entities/user.entity';
import { RequestResetPasswordDto } from './dto/requestResetPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Auth(ValidRoles.COLEADER)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.usersService.findOne(term);
  }

  @Patch('request-reset-password')
  requestResetPassword(
    @Body() requestResetPasswordDto: RequestResetPasswordDto,
  ) {
    return this.usersService.requestResetPassword(requestResetPasswordDto);
  }

  @Patch('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.usersService.resetPassword(resetPasswordDto);
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
    return this.usersService.changePassword(user, changePasswordDto);
  }

  @Patch(':id')
  update(
    @Param('id', ValidateMongoIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ValidateMongoIdPipe) id: string) {
    return this.usersService.remove(id);
  }

  @Post('u/generate-code')
  @Auth(ValidRoles.COLEADER)
  generateCode(@GetUser() user: User) {
    return this.usersService.generateCode(user);
  }

  @Delete('u/delete-code')
  @Auth(ValidRoles.COLEADER)
  deleteCode(@GetUser() user: User) {
    return this.usersService.deleteCode(user);
  }
}

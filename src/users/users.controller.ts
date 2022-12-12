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
import { Auth } from '..//auth/decorators';
import { ValidRoles } from '..//auth/interfaces';
import { RequestResetPasswordDto } from './dto/requestResetPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('seed')
  seed() {
    return this.usersService.seed();
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Auth(ValidRoles.LIDER, ValidRoles.COLEADER)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('number-active')
  getNumberOfActiveUsers() {
    return this.usersService.getNumberOfActiveUsers();
  }

  @Get('active')
  getActiveUsers() {
    return this.usersService.getActiveUsers();
  }

  @Get('top5-points')
  getTop5MembersWithBestPoints() {
    return this.usersService.getTop5MembersWithBestPoints();
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
}

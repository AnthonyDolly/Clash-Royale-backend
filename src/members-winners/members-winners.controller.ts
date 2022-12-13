import { Controller, Get, Post, Body } from '@nestjs/common';
import { MembersWinnersService } from './members-winners.service';
import { CreateMembersWinnerDto } from './dto/create-members-winner.dto';
import { Auth } from './../auth/decorators';
import { ValidRoles } from './../auth/interfaces';

@Controller('members-winners')
export class MembersWinnersController {
  constructor(private readonly membersWinnersService: MembersWinnersService) {}

  @Auth(ValidRoles.LIDER)
  @Post()
  create(@Body() createMembersWinnerDto: CreateMembersWinnerDto) {
    return this.membersWinnersService.create(createMembersWinnerDto);
  }

  @Get()
  findAll() {
    return this.membersWinnersService.findAll();
  }
}

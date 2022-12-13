import { Controller, Get, Post, Body } from '@nestjs/common';
import { MembersWinnersService } from './members-winners.service';
import { CreateMembersWinnerDto } from './dto/create-members-winner.dto';

@Controller('members-winners')
export class MembersWinnersController {
  constructor(private readonly membersWinnersService: MembersWinnersService) {}

  @Post()
  create(@Body() createMembersWinnerDto: CreateMembersWinnerDto) {
    return this.membersWinnersService.create(createMembersWinnerDto);
  }

  @Get()
  findAll() {
    return this.membersWinnersService.findAll();
  }
}

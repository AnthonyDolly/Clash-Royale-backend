import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get('test')
  test() {
    return this.membersService.getDataFromClashRoyaleApi();
  }

  @Post()
  create() {
    return this.membersService.create();
  }

  @Get()
  findAll() {
    return this.membersService.findAll();
  }

  @Get('quantity')
  getNumberOfMembers() {
    return this.membersService.getNumberOfMembers();
  }

  @Get('test2')
  test2() {
    return this.membersService.getInformationOfCurrentRiverRace();
  }

  @Get('decks-pending')
  getMembersWithDecksPending() {
    return this.membersService.getMembersWithDecksPending();
  }

  @Get('donations-pending')
  getMembersWithDonationsPending() {
    return this.membersService.getMembersWithDonationsPending();
  }

  @Get('top5-current-war')
  getTop5MembersOfCurrentWar() {
    return this.membersService.getTop5MembersOfCurrentWar();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
    return this.membersService.update(+id, updateMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membersService.remove(+id);
  }
}

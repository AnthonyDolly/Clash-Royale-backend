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

  @Get('number-decks-pending')
  getNumberOfMembersWithDecksPending() {
    return this.membersService.getNumberOfMembersWithDecksPending();
  }

  @Get('decks-pending')
  getMembersWithDecksPending() {
    return this.membersService.getMembersWithDecksPending();
  }

  @Get('number-donations-pending')
  getNumberOfMembersWithDonationsPending() {
    return this.membersService.getNumberOfMembersWithDonationsPending();
  }

  @Get('donations-pending')
  getMembersWithDonationsPending() {
    return this.membersService.getMembersWithDonationsPending();
  }

  @Get('top5-current-war')
  getTop5MembersOfCurrentWar() {
    return this.membersService.getTop5MembersOfCurrentWar();
  }

  @Get('current-war')
  getCurrentWar() {
    return this.membersService.getCurrentWar();
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

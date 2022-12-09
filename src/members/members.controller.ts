import { Controller, Get } from '@nestjs/common';
import { MembersService } from './members.service';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  findAll() {
    return this.membersService.findAll();
  }

  @Get('quantity')
  getNumberOfMembers() {
    return this.membersService.getNumberOfMembers();
  }

  @Get('number-donations-pending')
  getNumberOfMembersWithDonationsPending() {
    return this.membersService.getNumberOfMembersWithDonationsPending();
  }

  @Get('donations-pending')
  getMembersWithDonationsPending() {
    return this.membersService.getMembersWithDonationsPending();
  }
}

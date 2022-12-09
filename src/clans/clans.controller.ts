import { Controller, Get, Param } from '@nestjs/common';
import { ClansService } from './clans.service';

@Controller('clans')
export class ClansController {
  constructor(private readonly clansService: ClansService) {}

  @Get('number-decks-pending')
  getNumberOfMembersWithDecksPending() {
    return this.clansService.getNumberOfMembersWithDecksPending();
  }

  @Get('decks-pending')
  getMembersWithDecksPending() {
    return this.clansService.getMembersWithDecksPending();
  }

  @Get('top5-current-war')
  getTop5MembersOfCurrentWar() {
    return this.clansService.getTop5MembersOfCurrentWar();
  }

  @Get('dashboard')
  getDashboard() {
    return this.clansService.getDashboard();
  }

  @Get('current-war')
  getCurrentWar() {
    return this.clansService.getCurrentWar();
  }

  @Get('river-race-log-dates')
  getRiverRaceLog() {
    return this.clansService.getRiverRaceLogDates();
  }

  @Get('river-race-log/:dateString')
  getRiverRaceLogByDate(@Param('dateString') dateString: string) {
    return this.clansService.getRiverRaceLogByDate(dateString);
  }
}

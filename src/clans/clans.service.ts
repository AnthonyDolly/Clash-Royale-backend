import { Injectable } from '@nestjs/common';

import { AxiosAdapter } from './../common/adapters/axios.adapter';
import {
  ClanRiverRaceLog,
  ClashCurrentWarResponse,
  ClashResponse,
} from './interfaces';

@Injectable()
export class ClansService {
  constructor(private readonly http: AxiosAdapter) {}

  async getDataFromClashRoyaleApi() {
    const data = await this.http.get<ClashResponse>(
      'https://api.clashroyale.com/v1/clans/%232VY922LJ',
      {
        headers: {
          Authorization: `Bearer ${process.env.CLASH_ROYALE_API_KEY}`,
        },
      },
    );

    return data.memberList;
  }

  async getCurrentRiverRace() {
    const data = await this.http.get<ClashCurrentWarResponse>(
      'https://api.clashroyale.com/v1/clans/%232VY922LJ/currentriverrace',
      {
        headers: {
          Authorization: `Bearer ${process.env.CLASH_ROYALE_API_KEY}`,
        },
      },
    );

    return data.clan.participants;
  }

  async getLastRiverRaceLog() {
    const data = await this.http.get<ClanRiverRaceLog>(
      'https://api.clashroyale.com/v1/clans/%232VY922LJ/riverracelog?limit=4',
      {
        headers: {
          Authorization: `Bearer ${process.env.CLASH_ROYALE_API_KEY}`,
        },
      },
    );

    return data.items;
  }

  async getNumberOfMembersWithDecksPending() {
    const members = await this.getDataFromClashRoyaleApi();
    const currentRiverRace = await this.getCurrentRiverRace();

    const numberOfMembersWithDecksPending = [];

    members.forEach((member) => {
      currentRiverRace.find((riverRaceMember) => {
        if (riverRaceMember.tag === member.tag) {
          numberOfMembersWithDecksPending.push({
            tag: member.tag,
            name: member.name,
            role: member.role,
            decksPending: 4 - riverRaceMember.decksUsedToday,
            fame: riverRaceMember.fame,
            lastSeen: this.formatDate(member.lastSeen),
          });
        }
      });
    });

    return {
      membersWithDecksPending: numberOfMembersWithDecksPending.filter(
        (member) => member.decksPending > 0,
      ).length,
    };
  }

  async getMembersWithDecksPending() {
    const members = await this.getDataFromClashRoyaleApi();
    const currentRiverRace = await this.getCurrentRiverRace();

    const membersWithDecksPending = [];

    members.forEach((member) => {
      currentRiverRace.find((riverRaceMember) => {
        if (riverRaceMember.tag === member.tag) {
          membersWithDecksPending.push({
            tag: member.tag,
            name: member.name,
            role: member.role,
            decksPending: 4 - riverRaceMember.decksUsedToday,
            fame: riverRaceMember.fame,
            lastSeen: this.formatDate(member.lastSeen),
          });
        }
      });
    });

    return {
      date: new Date(),
      membersWithDecksPending: membersWithDecksPending.filter(
        (member) => member.decksPending > 0,
      ),
    };
  }

  async getTop5MembersOfCurrentWar() {
    const currentRiverRace = await this.getCurrentRiverRace();

    const top5Members = currentRiverRace
      .sort((a, b) => b.fame - a.fame)
      .slice(0, 5);

    return {
      date: new Date(),
      top5Members,
    };
  }

  async getDashboard() {
    const riverRaceLog = await this.getLastRiverRaceLog();

    const dates = [];
    const fames = [];
    riverRaceLog.map((riverRace) => {
      dates.push(this.formatDate(riverRace.createdDate, 2));
      fames.push(
        riverRace.standings.filter(
          (standing) => standing.clan.tag === '#2VY922LJ',
        )[0].clan.fame,
      );
    });

    return {
      dates,
      fames,
    };
  }

  async getCurrentWar() {
    const currentRiverRace = await this.getCurrentRiverRace();

    if (!currentRiverRace) {
      return 'No current war';
    }

    const currentWar = currentRiverRace.sort((a, b) => b.fame - a.fame);

    return {
      date: new Date(),
      currentWar,
    };
  }

  async getRiverRaceLogDates() {
    const riverRaceLog = await this.getLastRiverRaceLog();

    return riverRaceLog.map((riverRace) => {
      return {
        date: this.formatDate(riverRace.createdDate, 2),
        rank: riverRace.standings
          .filter((standing) => standing.clan.tag === '#2VY922LJ')
          .map((standing) => standing.rank),
        dateString: riverRace.createdDate,
      };
    });
  }

  async getRiverRaceLogByDate(dateString: string) {
    const riverRaceLog = await this.getLastRiverRaceLog();

    const riverRaceLogByDate = riverRaceLog.find(
      (riverRace) => riverRace.createdDate === dateString,
    );

    const riverRaceLogByClanTag = riverRaceLogByDate.standings
      .filter((standing) => standing.clan.tag === '#2VY922LJ')
      .map((standing) => {
        return {
          date: this.formatDate(riverRaceLogByDate.createdDate, 2),
          rank: standing.rank,
          trophyChange: standing.trophyChange,
          clan: standing.clan,
        };
      });

    return riverRaceLogByClanTag;
  }

  private formatDate(lastSeen: string, option?: number) {
    const b = lastSeen.split('T');

    const date = b[0].split('');

    const year = date[0] + date[1] + date[2] + date[3];

    const month = date[4] + date[5];

    const day = date[6] + date[7];

    const time = b[1].split('.');

    const hour = time[0].split('');

    const minutes = hour[2] + hour[3];

    const seconds = hour[4] + hour[5];

    const newDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour[0] + hour[1]),
      parseInt(minutes),
      parseInt(seconds),
    );

    const date2 = new Date(
      new Date().toLocaleString('en', { timeZone: 'WET' }),
    );

    if (option === 2) {
      return newDate;
    }

    const diff = date2.getTime() - newDate.getTime();

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    const hours = Math.floor(diff / (1000 * 60 * 60));

    const minutes2 = Math.floor(diff / (1000 * 60));

    const seconds2 = Math.floor(diff / 1000);

    if (days > 0) {
      return `${days}d`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else if (minutes2 > 0) {
      return `${minutes2}m`;
    } else if (seconds2 > 0) {
      return `${seconds2}s`;
    } else {
      return 'En linea';
    }
  }
}

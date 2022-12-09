import { Injectable } from '@nestjs/common';

import { AxiosAdapter } from './../common/adapters/axios.adapter';
import { ClashResponse } from './interfaces/clash-response.interface';

@Injectable()
export class MembersService {
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

  async findAll() {
    const members = await this.getDataFromClashRoyaleApi();

    if (!members) {
      return 'No members found';
    }

    return {
      date: new Date(),
      members: members.map((member) => {
        return {
          clanRank: member.clanRank,
          tag: member.tag,
          name: member.name,
          role: member.role,
          donationsReceived: member.donationsReceived,
          donations: member.donations,
          trophies: member.trophies,
          lastSeen: this.formatDate(member.lastSeen),
        };
      }),
    };
  }

  async getNumberOfMembers() {
    const members = await this.getDataFromClashRoyaleApi();

    if (members) {
      return {
        miembros: `${members.length}/50`,
      };
    }
  }

  async getNumberOfMembersWithDonationsPending() {
    const members = await this.getDataFromClashRoyaleApi();
    const membersWithDonationsPending = members.filter(
      (member) => member.donations < 50,
    );

    return {
      membersWithDonationsPending: membersWithDonationsPending.length,
    };
  }

  async getMembersWithDonationsPending() {
    const members = await this.getDataFromClashRoyaleApi();

    const membersWithDonationsPending = members.filter(
      (member) => member.donations < 50,
    );

    return {
      date: new Date(),
      membersWithDonationsPending: membersWithDonationsPending.map((member) => {
        return {
          tag: member.tag,
          name: member.name,
          role: member.role,
          donations: member.donations,
          donationsReceived: member.donationsReceived,
          lastSeen: this.formatDate(member.lastSeen),
        };
      }),
    };
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

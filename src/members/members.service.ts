import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './entities/member.entity';

import { UsersService } from '../users/users.service';
import { AxiosAdapter } from './../common/adapters/axios.adapter';
import { ClashResponse } from './interfaces/clash-response.interface';
import { ClashCurrentWarResponse } from './interfaces/clash-current-war-response.interface';
import { ClanRiverRaceLog } from './interfaces/clan-river-race-log.interface';

@Injectable()
export class MembersService {
  constructor(
    @InjectModel(Member.name) private readonly memberModel: Model<Member>,
    private readonly http: AxiosAdapter,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

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

  //get information about clan's current river race
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

  async getInformationOfCurrentRiverRace() {
    const currentRiverRace = await this.getCurrentRiverRace();

    return currentRiverRace;
  }

  async getNumberOfMembersWithDecksPending() {
    const members = await this.getDataFromClashRoyaleApi();
    const currentRiverRace = await this.getCurrentRiverRace();

    const membersWithDecksPending = members.map((member) => {
      const memberWithDeck = currentRiverRace.find(
        (riverRaceMember) => riverRaceMember.tag === member.tag,
      );

      return memberWithDeck;
    });

    const numberOfMembersWithDecksPending = membersWithDecksPending.filter(
      (member) => member.decksUsedToday < 4,
    );

    return {
      membersWithDecksPending: numberOfMembersWithDecksPending.length,
    };
  }

  async getMembersWithDecksPending() {
    const members = await this.getDataFromClashRoyaleApi();
    const currentRiverRace = await this.getCurrentRiverRace();

    const membersWithDecksPending = members.map((member) => {
      const memberData = currentRiverRace.find(
        (riverRaceMember) => riverRaceMember.tag === member.tag,
      );

      return {
        tag: member.tag,
        name: member.name,
        role: member.role,
        decksPending: 4 - memberData.decksUsedToday,
        fame: memberData.fame,
        lastSeen: this.formatDate(member.lastSeen),
      };
    });

    return {
      date: new Date(),
      membersWithDecksPending: membersWithDecksPending.filter(
        (member) => member.decksPending > 0,
      ),
    };
  }

  async getNumberOfMembersWithDonationsPending() {
    const members = await this.getDataFromClashRoyaleApi();
    const membersWithDonationsPending = members.filter(
      (member) => member.donationsReceived < 50,
    );

    return {
      membersWithDonationsPending: membersWithDonationsPending.length,
    };
  }

  async getMembersWithDonationsPending() {
    const members = await this.getDataFromClashRoyaleApi();

    const membersWithDonationsPending = members.filter(
      (member) => member.donationsReceived < 50,
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

  async findOne(id: string) {
    if (!id.includes('#')) {
      id = `#${id}`;
    }
    const member = await this.memberModel.findOne({ tag: id });

    if (!member) {
      throw new NotFoundException(`Member with tag ${id} not found`);
    }

    return member;
  }

  async create() {
    const members = await this.memberModel.find();
    const membersFromApi = await this.getDataFromClashRoyaleApi();

    // Buscando los miembros de la API en la base de datos
    membersFromApi.forEach(async (memberFromApi) => {
      const member = await this.findOne(memberFromApi.tag);

      if (!member) {
        const newMember = new this.memberModel(memberFromApi);
        newMember.save();
      } else if (member) {
        if (member.isActive === false) {
          member.isActive = true;
          member.save();
        }
      }
    });

    // Buscando los miembros de la base de datos en la API
    members.forEach((member) => {
      const memberFromApi = membersFromApi.find(
        (memberFromApi) => memberFromApi.tag === member.tag,
      );

      if (!memberFromApi) {
        if (member.isActive === true) {
          member.isActive = false;
          member.save();
        }
      }
    });

    setTimeout(async () => {
      const user = await this.usersService.findIfUserExist('8V98QYV8P');
      if (!user) {
        const newUser = await this.usersService.create({
          name: 'Shirley',
          lastName: 'Cruz',
          phone: '+51999999999',
          email: 'shirley@gmail.com',
          password: 'Abc123',
          code: null,
          tag: '#8V98QYV8P',
          gender: '',
          birthDate: null,
        });
        newUser.save();
      }
    }, 2000);

    return 'Members Inserted';
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

  update(id: number, updateMemberDto: UpdateMemberDto) {
    return `This action updates a #${id} member`;
  }

  remove(id: number) {
    return `This action removes a #${id} member`;
  }

  async getNumberOfMembers() {
    const members = await this.getDataFromClashRoyaleApi();

    if (members) {
      return {
        miembros: `${members.length}/50`,
      };
    }
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

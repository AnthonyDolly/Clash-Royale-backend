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

    const membersActive = await this.memberModel
      .find({ isActive: true })
      .select('tag -_id');

    const currentDate = new Date();
    const members = membersActive.map((member) => {
      const memberData = data.clan.participants.find(
        (participant) => participant.tag === member.tag,
      );

      return {
        name: memberData.name,
        tag: memberData.tag,
        fame: memberData.fame,
        repairPoints: memberData.repairPoints,
        boatAttacks: memberData.boatAttacks,
        decksUsed: memberData.decksUsed,
        decksUsedToday: memberData.decksUsedToday,
      };
    });

    return members;
  }

  async getInformationOfCurrentRiverRace() {
    const currentRiverRace = await this.getCurrentRiverRace();

    return currentRiverRace;
  }

  async getNumberOfMembersWithDecksPending() {
    const currentRiverRace = await this.getCurrentRiverRace();

    const membersWithDecksPending = currentRiverRace.filter(
      (member) => member.decksUsedToday < 4,
    );

    return {
      membersWithDecksPending: membersWithDecksPending.length,
    };
  }

  async getMembersWithDecksPending() {
    const currentRiverRace = await this.getCurrentRiverRace();

    const membersWithDecksPending = currentRiverRace.filter(
      (member) => member.decksUsedToday < 4,
    );

    return {
      date: new Date(),
      membersWithDecksPending,
    };
  }

  async getNumberOfMembersWithDonationsPending() {
    const members = await this.memberModel.find({ isActive: true });
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
      membersWithDonationsPending,
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
          photo: '',
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
      members,
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
}

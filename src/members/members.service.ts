import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './entities/member.entity';

import { AxiosAdapter } from './../common/adapters/axios.adapter';
import { ClashResponse } from './interfaces/clash-response.interface';

@Injectable()
export class MembersService {
  constructor(
    @InjectModel(Member.name) private readonly memberModel: Model<Member>,
    private readonly http: AxiosAdapter,
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

  findOne(id: string) {
    if (!id.includes('#')) {
      id = `#${id}`;
    }
    try {
      const member = this.memberModel.findOne({ tag: id });
      return member;
    } catch (error) {
      return error;
    }
  }

  async create() {
    const members = await this.memberModel.find();
    const membersFromApi = await this.getDataFromClashRoyaleApi();

    // Buscando los miembros de la API en la base de datos
    membersFromApi.forEach((memberFromApi) => {
      const member = this.findOne(memberFromApi.tag);

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

    return 'Members Inserted';
  }

  async findAll() {
    const members = await this.memberModel.find();
    return members;
  }

  update(id: number, updateMemberDto: UpdateMemberDto) {
    return `This action updates a #${id} member`;
  }

  remove(id: number) {
    return `This action removes a #${id} member`;
  }
}

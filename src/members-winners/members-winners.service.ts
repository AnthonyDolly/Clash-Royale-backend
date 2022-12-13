import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { CreateMembersWinnerDto } from './dto/create-members-winner.dto';
import { MembersService } from './../members/members.service';
import { MembersWinner } from './entities/members-winner.entity';

@Injectable()
export class MembersWinnersService {
  constructor(
    @InjectModel(MembersWinner.name)
    private readonly membersWinnerModel: Model<MembersWinner>,
    private readonly membersService: MembersService,
  ) {}

  async create(createMembersWinnerDto: CreateMembersWinnerDto) {
    const members = createMembersWinnerDto.members;

    const randomMember = members[Math.floor(Math.random() * members.length)];

    const membersWinners = await this.membersWinnerModel.create({
      tag: randomMember.tag,
    });

    return {
      name: randomMember.name,
      membersWinners,
    };
  }

  async findAll() {
    const members = await this.membersService.getDataFromClashRoyaleApi();
    const membersWinners = await this.membersWinnerModel.find();

    const membersWinnersFinal = [];

    membersWinners.forEach((memberWinner) => {
      members.find((member) => {
        if (member.tag === memberWinner.tag) {
          membersWinnersFinal.push({
            name: member.name,
            membersWinners: memberWinner,
          });
        }
      });
    });

    return membersWinnersFinal;
  }
}

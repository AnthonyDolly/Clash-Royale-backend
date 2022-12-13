import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { CreateMembersWinnerDto } from './dto/create-members-winner.dto';
import { MembersWinner } from './entities/members-winner.entity';

@Injectable()
export class MembersWinnersService {
  constructor(
    @InjectModel(MembersWinner.name)
    private readonly membersWinnerModel: Model<MembersWinner>,
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
    const membersWinners = await this.membersWinnerModel.find();

    return membersWinners;
  }
}

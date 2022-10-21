import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { Member, MemberSchema } from './entities/member.entity';
import { CommonModule } from './../common/common.module';
import { UsersModule } from './../users/users.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule,
    CommonModule,
    MongooseModule.forFeature([
      {
        name: Member.name,
        schema: MemberSchema,
      },
    ]),
  ],
  controllers: [MembersController],
  providers: [MembersService],
  exports: [MongooseModule, MembersService],
})
export class MembersModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { CommonModule } from './../common/common.module';

@Module({
  imports: [ConfigModule, CommonModule],
  controllers: [MembersController],
  providers: [MembersService],
  exports: [MembersService],
})
export class MembersModule {}

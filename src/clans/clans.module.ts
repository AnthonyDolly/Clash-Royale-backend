import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { ClansService } from './clans.service';
import { ClansController } from './clans.controller';
import { CommonModule } from './../common/common.module';

@Module({
  imports: [CommonModule, ConfigModule],
  controllers: [ClansController],
  providers: [ClansService],
  exports: [ClansService],
})
export class ClansModule {}

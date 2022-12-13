import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EnvConfiguration } from './../config/app.config';
import { JoiValidationSchema } from './../config/joi.validation';
import { MembersWinnersService } from './members-winners.service';
import { MembersWinnersController } from './members-winners.controller';
import {
  MembersWinner,
  MembersWinnerSchema,
} from './entities/members-winner.entity';
import { AuthModule } from './../auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema,
    }),
    MongooseModule.forFeature([
      {
        name: MembersWinner.name,
        schema: MembersWinnerSchema,
      },
    ]),
    AuthModule,
  ],
  controllers: [MembersWinnersController],
  providers: [MembersWinnersService],
})
export class MembersWinnersModule {}

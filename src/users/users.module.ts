import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { MembersModule } from './../members/members.module';
import { AuthModule } from './../auth/auth.module';

import { SendGridModule } from '@anchan828/nest-sendgrid';
import { EnvConfiguration } from './../config/app.config';
import { JoiValidationSchema } from './../config/joi.validation';
import { ProfileController } from './profile/profile.controller';
import { ProfileService } from './profile/profile.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema,
    }),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    MembersModule,
    AuthModule,
    SendGridModule.forRoot({
      apikey: process.env.CLASH_ROYALE_MAIL_API_KEY,
    }),
  ],
  controllers: [UsersController, ProfileController],
  providers: [UsersService, ProfileService],
  exports: [MongooseModule, UsersService],
})
export class UsersModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from './users/users.module';
import { MembersModule } from './members/members.module';
import { CommonModule } from './common/common.module';
import { EnvConfiguration } from './config/app.config';
import { JoiValidationSchema } from './config/joi.validation';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { MessagesWsModule } from './messages-ws/messages-ws.module';
import { ClansModule } from './clans/clans.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema,
    }),
    UsersModule,
    MembersModule,
    CommonModule,
    MongooseModule.forRoot(process.env.MONGODB),
    AuthModule,
    FilesModule,
    MessagesWsModule,
    ClansModule,
  ],
})
export class AppModule {}

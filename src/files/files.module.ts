import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { EnvConfiguration } from './../config/app.config';
import { JoiValidationSchema } from './../config/joi.validation';
import { AuthModule } from './../auth/auth.module';
import { UsersModule } from './../users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema,
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}

import { Response } from 'express';
import { diskStorage } from 'multer';

import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';

import { FilesService } from './files.service';
import { fileFilter } from './helpers/fileFilter.helper';
import { fileNamer } from './helpers/fileNamer.helper';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from './../users/entities/user.entity';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Post('users')
  @Auth(
    ValidRoles.LIDER,
    ValidRoles.COLEADER,
    ValidRoles.VETERANO,
    ValidRoles.MIEMBRO,
  )
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      limits: {
        fileSize: 1024 * 1024,
      },
      storage: diskStorage({
        destination: './static/users',
        filename: fileNamer,
      }),
    }),
  )
  uploadUserImage(
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.filesService.uploadUserImage(user, file);
  }

  @Get('users/:imageName')
  findUserImage(@Res() res: Response, @Param('imageName') imageName: string) {
    const path = this.filesService.getStaticUserImage(imageName);

    res.sendFile(path);
  }
}

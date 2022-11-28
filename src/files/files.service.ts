import { join } from 'path';
import { existsSync, unlink } from 'fs';

import { BadRequestException, Injectable } from '@nestjs/common';

import { User } from './../users/entities/user.entity';
import { UsersService } from './../users/users.service';

@Injectable()
export class FilesService {
  constructor(private readonly usersService: UsersService) {}

  async uploadUserImage(user: User, file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Make sure you upload a image.');

    const secureUrl = `${file.filename}`;

    const currentUser = await this.usersService.findOne(user.id);

    const userPhoto = currentUser.photo;

    if (userPhoto) {
      const photoPath = join(__dirname, '../../static/users', userPhoto);

      if (existsSync(photoPath)) {
        unlink(photoPath, (err) => {
          if (err) throw new BadRequestException(err);
        });

        currentUser.photo = secureUrl;

        await currentUser.save();

        return {
          secureUrl,
        };
      }
    } else if (!userPhoto) {
      currentUser.photo = secureUrl;

      await currentUser.save();

      return {
        secureUrl,
      };
    }
  }

  getStaticUserImage(imageName: string) {
    const path = join(__dirname, '../../static/users', imageName);

    if (!existsSync(path)) {
      throw new BadRequestException(`User Image with ${imageName} not found.`);
    }

    return path;
  }
}

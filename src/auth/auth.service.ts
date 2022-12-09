import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/entities/user.entity';
import { LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import * as bcrypt from 'bcryptjs';
import { MembersService } from './../members/members.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('ProductsService');
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly membersService: MembersService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const members = await this.membersService.getDataFromClashRoyaleApi();

    const user = await this.userModel.findOne({
      email,
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (!user.password) throw new UnauthorizedException('Invalid credentials');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Invalid credentials');

    const member = members.find((member) => member.tag === user.tag);

    if (!member) throw new UnauthorizedException('Inactive user');

    return {
      token: this.getJwt({
        id: user.id,
        name: user.name,
        role: member.role,
        photo: user.photo,
        points: user.points,
      }),
    };
  }

  async checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwt({
        id: user.id,
        name: user.name,
        role: '',
        photo: user.photo,
        points: user.points,
      }),
    };
  }

  private getJwt(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBExceptions(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}

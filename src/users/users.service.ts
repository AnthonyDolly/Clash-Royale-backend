import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { isValidObjectId, Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { MembersService } from './../members/members.service';
import { RequestResetPasswordDto } from './dto/requestResetPassword.dto';

import * as bcrypt from 'bcryptjs';
import { SendGridService } from '@anchan828/nest-sendgrid';
import { v4 as uuidv4 } from 'uuid';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @Inject(forwardRef(() => MembersService))
    private readonly membersService: MembersService,
    private readonly sendGrid: SendGridService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const member = await this.membersService.findOne(userData.tag);

      let invitedBy = null;
      if (userData.code) {
        invitedBy = await this.findOne(userData.code);
      }

      createUserDto.password = await bcrypt.hash(password, 10);

      const user = await this.userModel.create({
        ...userData,
        code: null,
        password: createUserDto.password,
        member: member._id,
        invitedBy: invitedBy ? invitedBy._id : null,
      });

      return user;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return await this.userModel
      .find()
      .populate({
        path: 'invitedBy',
        select: 'name lastName',
      })
      .populate({
        path: 'member',
        select: 'name tag',
      });
  }

  async getNumberOfActiveUsers() {
    const users = await this.userModel.find().populate({
      path: 'member',
      select: 'name tag isActive',
    });

    const activeMembers = users.filter((user) => user.member['isActive']);

    return {
      activeMembers: activeMembers.length,
    };
  }

  async getActiveUsers() {
    const users = await this.userModel
      .find()
      .select('name points member invitedBy')
      .populate({
        path: 'member',
        select: 'name tag role isActive',
      })
      .populate({
        path: 'invitedBy',
        select: 'name lastName',
      });

    const activeUsers = users.filter((user) => user.member['isActive']);

    return {
      activeUsers,
    };
  }

  async getTop5MembersWithBestPoints() {
    const users = await this.userModel
      .find()
      .select('points member')
      .populate({
        path: 'member',
        select: 'name tag',
      })
      .sort({ points: -1 })
      .limit(5);

    return users;
  }

  async findOne(term: string) {
    let user: User;

    if (isValidObjectId(term)) {
      user = await this.userModel
        .findById(term, { password: 0 })
        .populate({
          path: 'invitedBy',
          select: 'name lastName',
        })
        .populate({
          path: 'member',
          select: 'name tag',
        });
      if (user) return user;
    }

    if (term.includes('@')) {
      user = await this.userModel
        .findOne({ email: term }, { password: 0 })
        .populate({
          path: 'invitedBy',
          select: 'name lastName',
        })
        .populate({
          path: 'member',
          select: 'name tag',
        });
      if (user) return user;
    }

    if (!user) {
      user = await this.userModel.findOne({ code: term }, { password: 0 });
      if (user) return user;
    }

    if (!user) throw new NotFoundException(`User with ${term} not found`);

    return user;
  }

  async findIfUserExist(tag: string) {
    const member = await this.membersService.findOne(tag);
    console.log(member);

    const user = await this.userModel.findOne({
      member: member._id,
    });
    console.log(user);

    if (user) {
      return user;
    }

    return null;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto);

    if (!user) throw new NotFoundException(`User with ${id} not found`);

    return user;
  }

  async remove(id: string) {
    return await this.userModel.findByIdAndDelete(id);
  }

  async generateCode(user: User) {
    const code = Math.random().toString(36).substring(2, 10);

    const userCode = await this.userModel.findOne({ _id: user._id });

    if (userCode.code) {
      throw new BadRequestException(`User already has a code`);
    }

    await this.userModel.findByIdAndUpdate(user._id, { code }, { new: true });

    return { code };
  }

  async deleteCode(user: User) {
    await this.userModel.findByIdAndUpdate(
      user._id,
      { code: null },
      { new: true },
    );

    return { message: 'Code deleted' };
  }

  async requestResetPassword(requestResetPasswordDto: RequestResetPasswordDto) {
    const { email } = requestResetPasswordDto;

    const user = await this.findOne(email);

    user.resetPasswordToken = uuidv4();

    await user.save();

    const tkrp = user.resetPasswordToken;

    const sendEmail = await this.sendGrid.send({
      to: email,
      from: process.env.FROM_EMAIL,
      subject: 'Reset Password',
      html: `<html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Mailing</title>
        <style>
          @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;500;700&display=swap");
    
          * {
            margin: 0;
            font-family: "Roboto", sans-serif;
            padding: 0;
            box-sizing: border-box;
            -moz-stack-sizing: border-box;
            text-align: center;
          }
    
          html {
            min-height: 100%;
            position: relative;
          }
    
          body {
            /* padding-bottom: 140px */
          }
    
          .container {
            width: 80%;
            max-width: 1000px;
            margin: 0 auto;
            min-height: 100%;
            padding: 80px 0 0;
            position: relative;
            min-height: 100vh;
            padding-bottom: 140px;
          }
    
          .colorComuna {
            color: #0b1e51;
          }
    
          .backgroundComuna {
            background: #0b1e51;
          }
    
          .block-h1,
          .block-text,
          .block-button button {
            margin-top: 40px;
          }
    
          .block-button button {
            outline: none;
            border: 0;
            color: #fff;
            padding: 15px 25px;
            font-size: 16px;
            border-radius: 28px;
            cursor: pointer;
          }
          .block-button button a {
            text-decoration: none;
            color: #fff;
          }
          hr {
            margin: 45px 0;
          }
    
          .block-text-two p {
            text-align: start;
            margin-bottom: 35px;
          }
    
          .bfooter,
          .bfooter-movil {
            color: #fff;
            position: absolute;
            bottom: 0;
            width: 100%;
            left: 0;
            padding: 15px;
          }
          .bfooter-movil {
            display: none;
          }
          @media (max-width: 575.98px) {
            .bfooter {
              display: none;
            }
            .bfooter-movil {
              display: block;
            }
            .container {
              position: initial;
            }
          }
        </style>
      </head>
    
      <body>
        <div class="container">
          <div class="block-image">
            <img
              src="https://i.postimg.cc/GtnZMkds/logo.png"
              alt="Logo Clash"
              style="max-width: 235px"
            />
          </div>
          <div class="block-h1">
            <h1 class="color">¡Hola Jairo!</h1>
          </div>
          <div class="block-text">
            <p>
              ¿Olvidaste tu contraseña? Descuida, podrás obtener una nueva
              rápidamente. Solo presiona el botón que ves abajo y ¡listo!
            </p>
          </div>
          <div class="block-button">
            <button type="button" class="backgroundComuna">
              <a href="http://24.199.69.92:81/acceso/recuperar-contrasenia-step3?tkrp=${tkrp}">Restablecer contraseña</a>
            </button>
          </div>
          <hr />
          <div class="block-text-two">
            <p>
              Si no solicitaste restablecer tu contraseña, borra este mensaje y
              sigue disfrutanto de la aplicación disponible para ti.
            </p>
            <p>
              Un saludo, <br />
              El Clan Perú
            </p>
          </div>
          <footer class="backgroundComuna bfooter">
            <p>&copy 2022 Clan Perú</p>
          </footer>
        </div>
        <footer class="backgroundComuna bfooter-movil">
          <p>&copy 2022 Clan Perú</p>
        </footer>
    
        <script>
          function redirect() {
            window.location.href = "http://24.199.69.92:81/acceso/recuperar-contrasenia-step3?tkrp=${tkrp}";
          }
        </script>
      </body>
    </html>
      `,
    });

    return { message: 'Email sent' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { resetPasswordToken, password } = resetPasswordDto;

    const user = await this.userModel.findOne({ resetPasswordToken });

    if (!user) {
      throw new BadRequestException('Invalid token');
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;

    await user.save();

    return { message: 'Password reset' };
  }

  async changePassword(user: User, changePassword: ChangePasswordDto) {
    const { oldPassword, newPassword } = changePassword;

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      throw new BadRequestException('Invalid password');
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    return { message: 'Password changed' };
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      console.log(error);
      throw new BadRequestException(
        `User already exists in the database ${JSON.stringify(error.keyValue)}`,
      );
    } else if (error.status === 404) {
      throw new NotFoundException(error.message);
    }
    console.log(error);
    throw new InternalServerErrorException(`Check Server logs`);
  }
}

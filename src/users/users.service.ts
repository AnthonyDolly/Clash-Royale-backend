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

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
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

    setTimeout(() => {
      this.deleteCode(user);
    }, 7200000);

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

    const sendEmail = await this.sendGrid.send({
      to: email,
      from: process.env.FROM_EMAIL,
      subject: 'Reset Password',
      html: `
        <h1>Reset Password</h1>
        <p>Click the link below to reset your password</p>
        <a href="http://localhost:4200/reset-password/${user.resetPasswordToken}">Reset Password</a>
        
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
    }
    console.log(error);
    throw new InternalServerErrorException(`Check Server logs`);
  }
}

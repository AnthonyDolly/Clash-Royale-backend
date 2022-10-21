import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Member } from 'src/members/entities/member.entity';

@Schema()
export class User extends Document {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  lastName: string;

  @Prop({
    required: true,
    unique: true,
  })
  phone: string;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    required: false,
    default: null,
  })
  code: string;

  @Prop({
    required: false,
    default: null,
  })
  resetPasswordToken: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: false,
    index: true,
  })
  invitedBy: User | Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Member.name,
    required: true,
    unique: true,
  })
  member: Member | Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);

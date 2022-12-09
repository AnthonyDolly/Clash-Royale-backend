import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

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
    required: false,
    default: null,
  })
  gender: string;

  @Prop({
    required: false,
    default: null,
  })
  birthDate: Date;

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
    default: 0,
  })
  points: number;

  @Prop({
    required: false,
    default: null,
  })
  photo: string;

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
    required: true,
  })
  tag: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

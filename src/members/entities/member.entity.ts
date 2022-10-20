import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Member extends Document {
  @Prop({
    required: true,
    unique: true,
  })
  tag: string;

  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
    index: true,
    default: 'member',
  })
  role: string;

  @Prop({
    required: true,
  })
  lastSeen: string;

  @Prop({
    required: true,
  })
  expLevel: number;

  @Prop({
    required: true,
  })
  trophies: number;

  @Prop({
    required: true,
    type: Object,
  })
  arena: {
    id: number;
    name: string;
  };

  @Prop({
    required: true,
  })
  clanRank: number;

  @Prop({
    required: true,
  })
  previousClanRank: number;

  @Prop({
    required: true,
  })
  donations: number;

  @Prop({
    required: true,
  })
  donationsReceived: number;

  @Prop({
    required: true,
  })
  clanChestPoints: number;

  @Prop({
    required: true,
    default: true,
  })
  isActive: boolean;
}

export const MemberSchema = SchemaFactory.createForClass(Member);

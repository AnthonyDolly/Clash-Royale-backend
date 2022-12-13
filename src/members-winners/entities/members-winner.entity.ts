import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class MembersWinner extends Document {
  @Prop({
    required: true,
  })
  tag: string;

  @Prop({
    required: true,
    default: Date.now,
  })
  createdAt: Date;
}

export const MembersWinnerSchema = SchemaFactory.createForClass(MembersWinner);

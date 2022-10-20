import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsString,
} from 'class-validator';

export class CreateMemberDto {
  @IsNotEmpty()
  @IsString()
  tag: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  role: string;

  @IsNotEmpty()
  @IsString()
  lastSeen: string;

  @IsNotEmpty()
  @IsInt()
  expLevel: number;

  @IsNotEmpty()
  @IsInt()
  trophies: number;

  @IsNotEmpty()
  @IsObject()
  arena: {
    id: number;
    name: string;
  };

  @IsNotEmpty()
  @IsInt()
  clanRank: number;

  @IsNotEmpty()
  @IsInt()
  previousClanRank: number;

  @IsNotEmpty()
  @IsInt()
  donations: number;

  @IsNotEmpty()
  @IsInt()
  donationsReceived: number;

  @IsNotEmpty()
  @IsInt()
  clanChestPoints: number;
}

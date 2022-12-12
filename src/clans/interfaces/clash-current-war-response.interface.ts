// Generated by https://quicktype.io

export interface ClashCurrentWarResponse {
  state: string;
  clan: ClashCurrentWarResponseClan;
  clans: ClashCurrentWarResponseClan[];
  sectionIndex: number;
  periodIndex: number;
  periodType: string;
  periodLogs: PeriodLog[];
}

export interface ClashCurrentWarResponseClan {
  tag: Tag;
  name: string;
  badgeId: number;
  fame: number;
  repairPoints: number;
  participants: Participant[];
  periodPoints: number;
  clanScore: number;
}

export interface Participant {
  tag: string;
  name: string;
  fame: number;
  repairPoints: number;
  boatAttacks: number;
  decksUsed: number;
  decksUsedToday: number;
}

export enum Tag {
  Cpvv9Qj = '#CPVV9QJ',
  L9V022Rv = '#L9V022RV',
  Pq2U8Rq0 = '#PQ2U8RQ0',
  The2Vy922Lj = '#2VY922LJ',
  The92Uupg2G = '#92UUPG2G',
}

export interface PeriodLog {
  periodIndex: number;
  items: Item[];
}

export interface Item {
  clan: ItemClan;
  pointsEarned: number;
  progressStartOfDay: number;
  progressEndOfDay: number;
  endOfDayRank: number;
  progressEarned: number;
  numOfDefensesRemaining: number;
  progressEarnedFromDefenses: number;
}

export interface ItemClan {
  tag: Tag;
}
// Generated by https://quicktype.io

export interface ClanRiverRaceLog {
  items: Item[];
  paging: Paging;
}

export interface Item {
  seasonId: number;
  sectionIndex: number;
  createdDate: string;
  standings: Standing[];
}

export interface Standing {
  rank: number;
  trophyChange: number;
  clan: Clan;
}

export interface Clan {
  tag: string;
  name: string;
  badgeId: number;
  fame: number;
  repairPoints: number;
  finishTime: string;
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

export interface Paging {
  cursors: Cursors;
}

export interface Cursors {
  after: string;
}
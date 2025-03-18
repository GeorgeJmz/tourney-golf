export type DashboardLeaguesBody = {
  userId: string;
};

export type RequestGetDashboadLeagues = {
  body: DashboardLeaguesBody;
};

export interface ITournament {
  id?: string;
  author: string;
  name: string;
  tournamentType: string;
  players: number;
  groups: number;
  playersPerGroup: IGroup[];
  teams: IGroup[];
  conference: IGroup[];
  playType: string;
  startDate: string;
  cutOffDate: string;
  playOffsDate?: Date;
  playOffs: boolean;
  matchesPerRound: string[];
  playersList: Array<Partial<IPlayer>>;
  groupsList?: Array<ITournamentGroup>;
  teamsList?: Array<ITournamentGroup>;
  conferencesList?: Array<ITournamentGroup>;
  status: TournamentStatus;
  pointsPerWin: number;
  pointsPerTie: number;
  pointsPerWinMedal: number;
  pointsPerTieMedal: number;
  numberOfRounds?: number;
  roundDates?: string[];
  numberOfStages?: number;
  stagesDates?: {
    start: string;
    end: string;
  }[];
  championshipRound?: boolean;
  championshipDate?: string;
  minRounds?: number;
  playOffsDetail: IPlayOffsDetail;
  champion?: string;
  uuid?: string;
}

export interface IPlayOffsDetail {
  players: number;
  brackets: {
    [key: string]: string;
  };
  matches: {
    [key: string]: string[];
  };
}
export interface ITournamentGroup {
  id: string;
  name: string;
  conference?: string;
}

export enum TournamentStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  CLOSED = "closed",
}
export interface IPlayer {
  id: string;
  email: string;
  name: string;
  conference?: string;
  group?: string;
  team?: string;
  strokes?: number;
  handicap?: number;
  prevEmail?: string;
}

export interface IGroup {
  id: string;
  name: string;
  isEditing: boolean;
  players: IPlayer[];
}

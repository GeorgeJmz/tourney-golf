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

export interface statisticsPlayer {
  id: number;
  position: number;
  tourneyName: string;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  bonusPoints: number;
  matchPoints: number;
  medalPoints: number;
  totalPoints: number;
  grossAverage: string;
  handicapAverage: string;
  netAverage: string;
  teamPoints: number;
  conference: string;
  group: string;
}
export interface standingsType {
  name: string;
  points: number;
  position: number;
}
const endDate = new Date();
endDate.setDate(endDate.getDate() + 180);
const championshipDate = new Date();
championshipDate.setDate(championshipDate.getDate() + 181);
export default class TournamentModel implements ITournament {
  id? = "";
  author = "";
  name = "";
  tournamentType = "";
  players = 0;
  groups = 0;
  playersList = [] as Array<Partial<IPlayer>>;
  groupsList = [] as Array<ITournamentGroup>;
  teamsList = [] as Array<ITournamentGroup>;
  conferencesList = [] as Array<ITournamentGroup>;
  playersPerGroup = [] as Array<IGroup>;
  teams = [] as Array<IGroup>;
  playType = "";
  playOffs = false;
  startDate = new Date().toISOString();
  cutOffDate = endDate.toISOString();
  matchesPerRound = [] as string[];
  conference = [] as Array<IGroup>;
  status = TournamentStatus.DRAFT;
  pointsPerWin = 3;
  pointsPerTie = 1;
  pointsPerWinMedal = 3;
  pointsPerTieMedal = 1;
  numberOfRounds = 1;
  roundDates = [new Date().toISOString()];
  championshipRound = false;
  championshipDate = championshipDate.toISOString();
  minRounds = 1;
  playOffsDetail = {
    players: 0,
    brackets: {},
    matches: {},
  };
  numberOfStages = 1;
  stagesDates = [
    {
      start: new Date().toISOString(),
      end: new Date().toISOString(),
    },
  ];
  champion? = "";

  constructor(init?: Partial<TournamentModel>) {
    Object.assign(this, init);
  }
}

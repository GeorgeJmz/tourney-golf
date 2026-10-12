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
  playOffsStartDate?: string;
  playOffsCutOff?: string;
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
  weightedChampionshipRound?: number;
  championshipDate?: string;
  minRounds?: number;
  playOffsDetail: IPlayOffsDetail;
  champion?: string;
  createdAt?: string;
  lastActivityDate?: string;
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
  ACTIVE = "active",
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
  roundsPlayed: number;
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
import dayjs from "dayjs";

const endDate = dayjs().add(180, "day");
const championshipDate = dayjs().add(181, "day");
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
  playOffs = true;
  startDate = dayjs().format("MM/DD/YYYY");
  cutOffDate = endDate.format("MM/DD/YYYY");
  playOffsStartDate?: string;
  playOffsCutOff?: string;
  matchesPerRound = [] as string[];
  conference = [] as Array<IGroup>;
  status = TournamentStatus.DRAFT;
  pointsPerWin = 3;
  pointsPerTie = 1;
  pointsPerWinMedal = 3;
  pointsPerTieMedal = 1;
  numberOfRounds = 1;
  roundDates = [dayjs().format("MM/DD/YYYY")];
  championshipRound = false;
  weightedChampionshipRound = 1;
  championshipDate = championshipDate.format("MM/DD/YYYY");
  minRounds = 1;
  playOffsDetail = {
    players: 0,
    brackets: {},
    matches: {},
  };
  numberOfStages = 1;
  stagesDates = [
    {
      start: dayjs().format("MM/DD/YYYY"),
      end: dayjs().format("MM/DD/YYYY"),
    },
  ];
  champion? = "";
  createdAt? = "";
  lastActivityDate? = "";

  constructor(init?: Partial<TournamentModel>) {
    Object.assign(this, init);
  }
}

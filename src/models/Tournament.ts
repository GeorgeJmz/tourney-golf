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
  calcuta: boolean;
  playOffs: boolean;
  matchesPerRound: string[];
  playersList: Array<Partial<IPlayer>>;
  groupsList?: Array<ITournamentGroup>;
  teamsList?: Array<ITournamentGroup>;
  conferencesList?: Array<ITournamentGroup>;
  status: TournamentStatus;
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
}

export interface IGroup {
  id: string;
  name: string;
  isEditing: boolean;
  players: IPlayer[];
}
const endDate = new Date();
endDate.setDate(endDate.getDate() + 180);
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
  calcuta = false;
  playOffs = false;
  startDate = new Date().toISOString();
  cutOffDate = endDate.toISOString();
  matchesPerRound = [] as string[];
  conference = [] as Array<IGroup>;
  status = TournamentStatus.DRAFT;

  constructor(init?: Partial<TournamentModel>) {
    Object.assign(this, init);
  }
}

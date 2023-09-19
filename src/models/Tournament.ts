export interface ITournament {
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
}

export interface IPlayer {
  id: string;
  email: string;
  name: string;
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
endDate.setDate(endDate.getDate() + 15);
export default class TournamentModel implements ITournament {
  author = "";
  name = "";
  tournamentType = "";
  players = 0;
  groups = 0;
  playersPerGroup = [] as Array<IGroup>;
  teams = [] as Array<IGroup>;
  playType = "";
  calcuta = false;
  playOffs = false;
  startDate = new Date().toISOString();
  cutOffDate = endDate.toISOString();
  matchesPerRound = [] as string[];
  conference = [] as Array<IGroup>;

  constructor(init?: Partial<TournamentModel>) {
    Object.assign(this, init);
  }
}

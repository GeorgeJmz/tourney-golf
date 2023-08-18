export interface ITournament {
  author: string;
  name: string;
  tournamentType: string;
  players: number;
  groups: number;
  playersPerGroup: IGroup[];
  playType: string;
  startDate?: string;
  endDate?: string;
  playOffsDate?: Date;
  calcuta?: boolean;
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

export default class TournamentModel implements ITournament {
  author = "";
  name = "";
  tournamentType = "";
  players = 0;
  groups = 0;
  playersPerGroup = [] as Array<IGroup>;
  playType = "";

  constructor(init?: Partial<TournamentModel>) {
    Object.assign(this, init);
  }
}

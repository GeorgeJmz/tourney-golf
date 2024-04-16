export interface ITeam {
  id: string;
  name: string;
  players: Array<string>;
  points: number;
  conference: string;
}

export default class TeamModel implements ITeam {
  id = "";
  name = "";
  players = [] as Array<string>;
  points = 0;
  conference = "";

  constructor(init?: Partial<ITeam>) {
    Object.assign(this, init);
  }
}

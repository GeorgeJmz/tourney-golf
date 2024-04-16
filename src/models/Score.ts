export interface IScore {
  player: string;
  idPlayer: string;
  scoreHoles: Array<number>;
  scoreHolesHP: Array<number>;
  teamScoreHolesHP: Array<number>;
  handicap: number;
  out: number;
  in: number;
  totalGross: number;
  totalNet: number;
  teamPoints: Array<number>;
}

export default class ScoreModel implements IScore {
  player = "";
  idPlayer = "";
  scoreHoles: Array<number> = [];
  scoreHolesHP: Array<number> = [];
  teamScoreHolesHP: Array<number> = [];
  handicap = 0;
  out = 0;
  in = 0;
  totalGross = 0;
  totalNet = 0;
  teamPoints: Array<number> = [];

  constructor(init?: Partial<ScoreModel>) {
    Object.assign(this, init);
  }
}

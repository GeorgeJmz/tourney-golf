export interface IScore {
  player: string;
  idPlayer: string;
  scoreHoles: Array<number>;
  scoreHolesHP: Array<number>;
  strokes: number;
  out: number;
  in: number;
  total: number;
  totalNet: number;
}

export default class ScoreModel implements IScore {
  player = "";
  idPlayer = "";
  scoreHoles: Array<number> = [];
  scoreHolesHP: Array<number> = [];
  strokes = 0;
  out = 0;
  in = 0;
  total = 0;
  totalNet = 0;

  constructor(init?: Partial<ScoreModel>) {
    Object.assign(this, init);
  }
}

export interface IScore {
  player: string;
  idPlayer: string;
  scoreHoles: Array<number>;
  strokes: number;
  out: number;
  in: number;
  total: number;
}

export default class ScoreModel implements IScore {
  player = "";
  idPlayer = "";
  scoreHoles: Array<number> = [];
  strokes = 0;
  out = 0;
  in = 0;
  total = 0;

  constructor(init?: Partial<ScoreModel>) {
    Object.assign(this, init);
  }
}

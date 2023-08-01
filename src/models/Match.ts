export interface IMatch {
  author: string;
  course: string;
  courseDisplayName: string;
  teeBox: string;
  teeBoxDisplayName: string;
  scoresId: Array<string>;
  winner: string;
}

export default class MatchModel implements IMatch {
  author = "";
  course = "";
  courseDisplayName = "";
  teeBox = "";
  teeBoxDisplayName = "";
  winner = "";
  scoresId = ["", ""];

  constructor(init?: Partial<MatchModel>) {
    Object.assign(this, init);
  }
}

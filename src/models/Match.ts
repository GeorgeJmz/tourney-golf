export interface IMatch {
  author: string;
  course: string;
  courseDisplayName: string;
  teeBox: string;
  teeBoxDisplayName: string;
}

export default class MatchModel implements IMatch {
  author = "";
  course = "";
  courseDisplayName = "";
  teeBox = "";
  teeBoxDisplayName = "";

  constructor(init?: Partial<MatchModel>) {
    Object.assign(this, init);
  }
}

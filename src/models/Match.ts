export interface IMatchResults {
  idPlayer: string;
  playerName: string;
  score: number;
  gross: number;
  hcp: string;
  teamPoints: number;
  isWinnerMatch: boolean;
  isWinnerMedalPlay: boolean;
}
export interface IMatch {
  author: string;
  course: string;
  courseDisplayName: string;
  teeBox: string;
  teeBoxDisplayName: string;
  scoresId: Array<string>;
  winner: string;
  date: Array<string>;
  tournamentId: string;
  matchResults: Array<IMatchResults>;
}

export default class MatchModel implements IMatch {
  author = "";
  course = "";
  tournamentId = "";
  courseDisplayName = "";
  teeBox = "";
  teeBoxDisplayName = "";
  winner = "";
  scoresId = ["", ""];
  date = ["", ""];
  matchResults = [];

  constructor(init?: Partial<MatchModel>) {
    Object.assign(this, init);
  }
}

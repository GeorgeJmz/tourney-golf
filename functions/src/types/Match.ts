export interface IMatchResults {
  idPlayer: string;
  playerName: string;
  score: number;
  gross: number;
  hcp: string;
  teamPoints: number;
  isWinnerMatch: boolean;
  isWinnerMedalPlay: boolean;
  medalPoints?: number;
  matchPoints?: number;
  bonusPoints?: number;
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
  id?: string;
  round?: number;
}

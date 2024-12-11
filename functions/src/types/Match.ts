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
}

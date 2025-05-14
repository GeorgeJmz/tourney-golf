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

export interface Score {
  handicap: number;
  idPlayer: string;
  in: number;
  out: number;
  player: string;
  scoreHoles: number[];
  scoreHolesHP: number[];
  teamPoints: number[];
  teamScoreHolesHP: number[];
  totalGross: number;
  totalNet: number;
}

export interface Match {
  author: string;
  course: string;
  courseDisplayName: string;
  teeBox: string;
  teeBoxDisplayName: string;
  tournamentId: string;
  scores: Score[];
  winnerMatch: string[];
  winnerMedalPlay: string[];
  pointsPerWin: number;
  pointsPerTie: number;
  pointsPerWinMedal: number;
  pointsPerTieMedal: number;
}

export interface BodyCreateMatch
  extends Omit<
    Match,
    | "winnerMatch"
    | "winnerMedalPlay"
    | "pointsPerWin"
    | "pointsPerTie"
    | "pointsPerWinMedal"
    | "pointsPerTieMedal"
  > {
  message: string;
}
export interface RequestCreateMatch {
  body: BodyCreateMatch;
  params: { entryId: string };
}

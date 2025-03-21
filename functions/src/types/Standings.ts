export type StandingsBody = {
  leagueId: string;
};

export type RequestGetStandings = {
  body: StandingsBody;
};

export interface ITournamentPlayer {
  id: string;
  email: string;
  name: string;
  opponent: Array<string>;
  conference: string;
  group: string;
  team: string;
  pointsStroke: Array<number>;
  pointsMatch: Array<number>;
  pointsTeam: Array<number>;
  bonusPoints: Array<number>;
  gross: Array<number>;
  handicap: Array<number>;
  net: Array<number>;
  tournamentId: string;
  scoreId: Array<string>;
  date?: Array<string>;
}

export interface IUser {
  id: string;
  name: string;
  lastName: string;
  email: string;
  activeTournaments: string[];
  historyTournaments: string[];
  password?: string;
  ghinNumber?: string;
  handicap?: number;
  lastCourses?: string[];
}

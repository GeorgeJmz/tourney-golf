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

export default class PlayerModel implements ITournamentPlayer {
  id = "";
  email = "";
  name = "";
  opponent = [] as Array<string>;
  conference = "";
  group = "";
  team = "";
  pointsStroke = [];
  pointsTeam = [];
  pointsMatch = [];
  bonusPoints = [];
  scoreId = [];
  gross = [];
  handicap = [];
  net = [];
  tournamentId = "";
  date = [];

  constructor(init?: Partial<ITournamentPlayer>) {
    Object.assign(this, init);
  }
}

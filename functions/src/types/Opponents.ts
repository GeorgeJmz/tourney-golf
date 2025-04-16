export type OpponentsBody = {
  leagueId: string;
  userEmail: string;
};

export type RequestGetOpponents = {
  body: OpponentsBody;
};

/**
 * Represents the structure of a player object
 * within the ITournament.playersList array.
 */
export interface IOpponents {
  id: string; // Player document ID in the 'player' collection
  name: string;
  email: string;
  conference: string;
  group: string; // Or division, represents the player's group/division
  team?: string; // Optional team identifier
}

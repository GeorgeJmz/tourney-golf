import * as admin from "firebase-admin";
import { IMatch } from "../types/Match";

export const searchMatch = async (
  leagueId: string,
  players: Array<string>,
  author: string
) => {
  const matchExists: Array<{ matchExists: boolean; players: Array<string> }> =
    [];
  const db = admin.firestore();
  const matchesQuerySnapshot = await db
    .collection("match")
    .where("tournamentId", "==", leagueId)
    .get();

  if (matchesQuerySnapshot.empty) {
    return matchExists;
  }

  const distinctOtherPlayers = Array.from(
    new Set(players.filter((p) => p !== author))
  );

  matchesQuerySnapshot.forEach(
    (match: FirebaseFirestore.QueryDocumentSnapshot) => {
      const matchData = match.data() as IMatch;
      const pastMatchPlayerEmails = matchData.matchResults.map(
        (p) => p.idPlayer
      );
      const authorPlayedInPastMatch = pastMatchPlayerEmails.includes(author);

      if (authorPlayedInPastMatch) {
        for (const player of distinctOtherPlayers) {
          if (pastMatchPlayerEmails.includes(player)) {
            const exist = {
              matchExists: true,
              players: [author, player],
            } as { matchExists: boolean; players: Array<string> };
            matchExists.push(exist);
          }
        }
      }
    }
  );

  return matchExists;
};

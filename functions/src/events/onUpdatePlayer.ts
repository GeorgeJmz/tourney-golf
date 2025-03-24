import { onDocumentUpdatedWithAuthContext } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import { ITournamentPlayer } from "../types/Standings";

import { createStatistics } from "../helpers/createStatistics";

exports.onUpdatePlayer = onDocumentUpdatedWithAuthContext(
  "player/{playerId}",
  async (event) => {
    const previousValue = event.data?.before.data();
    const newValue = event.data?.after.data() as ITournamentPlayer;

    const isChanged = previousValue?.gross.length !== newValue?.gross.length;

    if (isChanged) {
      const leagueId = newValue.tournamentId;
      const sortedPlayers = await createStatistics(leagueId);
      logger.info("Player updated", { structuredData: true });
      logger.info("sortedPlayers", { structuredData: sortedPlayers });
      return;
    }
  }
);

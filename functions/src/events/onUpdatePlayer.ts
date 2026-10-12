import { onDocumentUpdatedWithAuthContext } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import { ITournamentPlayer } from "../types/Standings";

import { createStatistics } from "../helpers/createStatistics";

exports.onUpdatePlayer = onDocumentUpdatedWithAuthContext(
  "player/{playerId}",
  async (event) => {
    const previousValue = event.data?.before.data();
    const newValue = event.data?.after.data() as ITournamentPlayer;

    const hasBonusPointsChange = () => {
      if (previousValue?.bonusPoints.length !== newValue?.bonusPoints.length) {
        return true;
      }
      let hasChange = false;
      previousValue?.bonusPoints.forEach((bp: number, index: number) => {
        if (bp !== newValue?.bonusPoints[index]) {
          hasChange = true;
        }
      });
      return hasChange;
    };

    const hasMatchPointsChange = () => {
      if (previousValue?.pointsMatch.length !== newValue?.pointsMatch.length) {
        return true;
      }
      let hasChange = false;
      previousValue?.pointsMatch.forEach((mp: number, index: number) => {
        if (mp !== newValue?.pointsMatch[index]) {
          hasChange = true;
        }
      });
      return hasChange;
    };

    const hasStrokePointsChange = () => {
      if (
        previousValue?.pointsStroke.length !== newValue?.pointsStroke.length
      ) {
        return true;
      }
      let hasChange = false;
      previousValue?.pointsStroke.forEach((sp: number, index: number) => {
        if (sp !== newValue?.pointsStroke[index]) {
          hasChange = true;
        }
      });
      return hasChange;
    };

    const isChanged =
      hasBonusPointsChange() ||
      hasMatchPointsChange() ||
      hasStrokePointsChange();

    if (isChanged) {
      const leagueId = newValue.tournamentId;
      const sortedPlayers = await createStatistics(leagueId);
      logger.info("Player updated", { structuredData: true });
      logger.info("sortedPlayers", { structuredData: sortedPlayers });
      return;
    }
  }
);

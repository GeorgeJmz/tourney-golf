import { Response } from "express";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import { IOpponents, RequestGetOpponents } from "../types/Opponents";
import { ITournament, ITournamentPlayer } from "../types/DashboardLeagues";

/**
 * Finds potential opponents for a player in a "standard" league.
 * @param requestingPlayer Data of the player requesting opponents (ITournamentPlayer).
 * @param tournamentData Tournament data (ITournament).
 * @returns List of potential opponents (mapped structure).
 */
const findStandardOpponents = (
  requestingPlayer: ITournamentPlayer,
  tournamentData: ITournament
) => {
  const playedOpponentEmails = new Set(requestingPlayer.opponent || []); // Use Set for O(1) lookup

  return tournamentData.playersList
    .filter((potentialOpponent) => {
      const sameConference =
        potentialOpponent.conference === requestingPlayer.conference;
      const isNotSelf = potentialOpponent.email !== requestingPlayer.email;
      const hasNotPlayed = !playedOpponentEmails.has(
        potentialOpponent.email || ""
      );
      return sameConference && isNotSelf && hasNotPlayed;
    })
    .map((player) => ({
      name: player.name,
      email: player.email,
      conference: player.conference,
      division: player.group,
      team: player.team,
    })) as unknown as IOpponents[];
};

/**
 * Finds potential opponents for a player in a "dogfight" league.
 * (Implementation Pending)
 */
const findDogfightOpponents = (
  requestingPlayer: ITournamentPlayer,
  tournamentData: ITournament
) => {
  logger.info("Logic for Dogfight not yet implemented", {
    leagueId: tournamentData.id,
    userId: requestingPlayer.email,
  });
  // TODO: Implement specific logic for Dogfight
  return []; // Return type should match expected opponent structure
};

/**
 * Finds potential opponents for a player in a "teamplay" league.
 * (Implementation Pending)
 */
const findTeamplayOpponents = (
  requestingPlayer: ITournamentPlayer,
  tournamentData: ITournament
) => {
  logger.info("Logic for Teamplay not yet implemented", {
    leagueId: tournamentData.id,
    userId: requestingPlayer.email,
  });
  // TODO: Implement specific logic for Teamplay
  return []; // Return type should match expected opponent structure
};

export const getOpponents = async (req: RequestGetOpponents, res: Response) => {
  const { leagueId, userEmail } = req.body;

  if (!leagueId || typeof leagueId !== "string" || leagueId.trim() === "") {
    return res.status(400).json({ error: "Invalid or missing leagueId" });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!userEmail || typeof userEmail !== "string" || !emailRegex.test(userEmail)) {
    return res
      .status(400)
      .json({
        error: "Invalid or missing userEmail (should be a valid email format)",
      });
  }

  const db = admin.firestore();

  try {
    const tournamentRef = db.collection("tournament").doc(leagueId);
    const tournamentDoc = await tournamentRef.get();

    if (!tournamentDoc.exists) {
      logger.warn("Tournament not found", { leagueId });
      return res
        .status(404)
        .json({ error: `Tournament with ID ${leagueId} not found` });
    }

    const tournamentData = {
      id: tournamentDoc.id,
      ...tournamentDoc.data(),
    } as ITournament;

    const playerQuery = db
      .collection("player")
      .where("tournamentId", "==", leagueId)
      .where("email", "==", userEmail)
      .limit(1);

    const playerSnapshot = await playerQuery.get();

    if (playerSnapshot.empty) {
      logger.warn("Requesting player not found in this league", {
        leagueId,
        userEmail,
      });
      return res
        .status(404)
        .json({
          error: `Player with email ${userEmail} not found in league ${leagueId}`,
        });
    }

    const requestingPlayerDoc = playerSnapshot.docs[0];
    const requestingPlayer = {
      id: requestingPlayerDoc.id,
      ...requestingPlayerDoc.data(),
    } as ITournamentPlayer;

    let opponents: IOpponents[] = [];
    const leagueType = tournamentData.tournamentType || "standard";

    logger.info(`Determining opponents for league type: ${leagueType}`, {
      leagueId,
      userEmail,
    });

    switch (leagueType) {
      case "dogfight":
        opponents = findDogfightOpponents(requestingPlayer, tournamentData);
        break;
      case "teamplay":
        opponents = findTeamplayOpponents(requestingPlayer, tournamentData);
        break;
      case "standard":
      default:
        opponents = findStandardOpponents(requestingPlayer, tournamentData);
        break;
    }

    logger.info(`Found ${opponents.length} potential opponents`, {
      leagueId,
      userEmail,
      leagueType,
    });

    return res.status(200).json({
      status: "success",
      data: {
        opponents,
      },
    });
  } catch (error: unknown) {
    logger.error("Error fetching opponents", {
      leagueId,
      userEmail,
      errorMessage:
        error instanceof Error ? error.message : "Unknown error type",
      errorStack: error instanceof Error ? error.stack : undefined,
      errorDetails: error,
    });
    return res.status(500).json({
      error:
        "An unexpected error occurred while fetching opponents. Please try again later.",
      details: error instanceof Error ? error.message : undefined,
    });
  }
};

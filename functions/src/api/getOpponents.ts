import { Response } from "express";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import { IOpponents, RequestGetOpponents } from "../types/Opponents";
import { ITournament, ITournamentPlayer } from "../types/DashboardLeagues";
import * as dayjs from "dayjs";
import * as utc from "dayjs/plugin/utc";
import * as isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import * as isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { IMatch } from "../types/Match";

dayjs.extend(utc);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const parseDate = (
  dateInput: admin.firestore.Timestamp | Date | string | null | undefined
): dayjs.Dayjs | null => {
  if (!dateInput) {
    return null;
  }
  // Handle Firestore Timestamps
  if (typeof dateInput === "object" && "toDate" in dateInput) {
    return dayjs.utc(dateInput.toDate());
  }
  // Handle date strings (attempt parsing)
  const parsed = dayjs.utc(dateInput);
  return parsed.isValid() ? parsed : null;
};

const getRoundForDate = (
  tournament: ITournament,
  targetDate: dayjs.Dayjs
): number | null => {
  // Check regular rounds
  if (tournament.roundDates && tournament.roundDates.length > 0) {
    for (let i = 0; i < tournament.roundDates.length; i++) {
      const roundDate = parseDate(tournament.roundDates[i]);
      if (roundDate && roundDate.isSame(targetDate, "day")) {
        return i + 1; // Rounds are 1-based index
      }
    }
  }

  // Check championship round
  if (tournament.championshipRound) {
    const champDate = parseDate(tournament.championshipDate);
    if (champDate && champDate.isSame(targetDate, "day")) {
      return 0; // Championship round is 0
    }
  }

  return null; // No round scheduled for this date
};

const getMatchesByTournamentIdAndRound = async (
  db: admin.firestore.Firestore,
  tournamentId: string,
  round: number
): Promise<IMatch[]> => {
  const snapshot = await db
    .collection("match") // Use your actual collection name for Matches
    .where("tournamentId", "==", tournamentId)
    .where("round", "==", round)
    .get();

  if (snapshot.empty) {
    return [];
  }
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as IMatch));
};

const getPlayersWhoPlayedRoundsGreaterThanZero = async (
  db: admin.firestore.Firestore,
  tournamentId: string
): Promise<Set<string>> => {
  const snapshot = await db
    .collection("match") // Use your actual collection name for Matches
    .where("tournamentId", "==", tournamentId)
    // Firestore limitation: Cannot efficiently query for round > 0 with other filters.
    // Fetch all for the tournament and filter in code. Optimize if needed (e.g., dedicated field).
    .get();

  const players = new Set<string>();
  snapshot.forEach((doc) => {
    const data = doc.data() as IMatch;
    if (data.round !== undefined && data.round > 0 && data.matchResults) {
      data.matchResults.forEach((result) => players.add(result.idPlayer));
    }
  });
  return players;
};

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

const findDogfightOpponents = async (
  // Make async
  db: admin.firestore.Firestore, // Pass db instance
  requestingPlayer: ITournamentPlayer,
  tournamentData: ITournament
): Promise<IOpponents[]> => {
  // Return a Promise
  const today = dayjs.utc(); // Use server's current date in UTC
  const currentRound = getRoundForDate(tournamentData, today);

  if (currentRound === null) {
    logger.info("No Dogfight round scheduled for today.", {
      leagueId: tournamentData.id,
      date: today.format("YYYY-MM-DD"),
    });
    return []; // No round today, no opponents
  }

  logger.info(
    `Determining Dogfight opponents for round ${currentRound} on ${today.format(
      "YYYY-MM-DD"
    )}`,
    { leagueId: tournamentData.id }
  );

  // 1. Get players who have already played today's round
  const matchesForCurrentRound = await getMatchesByTournamentIdAndRound(
    db,
    tournamentData.id || "",
    currentRound
  );
  const playersWhoPlayedToday = new Set<string>(
    matchesForCurrentRound.flatMap((match) =>
      match.matchResults
        ? match.matchResults.map((player) => player.idPlayer)
        : []
    )
  );

  logger.info(
    `Players who played round ${currentRound} today: ${Array.from(
      playersWhoPlayedToday
    )}`,
    { leagueId: tournamentData.id }
  );

  // --- ADDED CHECK ---
  // 2. Check if the requesting player has already played today's round
  if (playersWhoPlayedToday.has(requestingPlayer.email || "")) {
    logger.info(
      `Requesting player ${requestingPlayer.email} has already played round ${currentRound} today. No opponents needed.`,
      { leagueId: tournamentData.id }
    );
    return []; // Return empty array if the player already played
  }
  // --- END ADDED CHECK ---

  // 3. Determine eligible players for today (if the requesting player hasn't played)
  let eligiblePlayersForToday: IOpponents[] = [];

  if (currentRound === 0) {
    // 3a. For Championship round, find players eligible (played > 0 rounds)
    const championshipEligiblePlayersEmails =
      await getPlayersWhoPlayedRoundsGreaterThanZero(
        db,
        tournamentData.id || ""
      );
    eligiblePlayersForToday = tournamentData.playersList
      .filter((p) => championshipEligiblePlayersEmails.has(p.email || ""))
      .map((player) => ({
        name: player.name,
        email: player.email,
        conference: player.conference,
        division: player.group,
        team: player.team,
      })) as unknown as IOpponents[];
    logger.info(
      `Championship eligible players: ${eligiblePlayersForToday.map(
        (p) => p.email
      )}`,
      {
        leagueId: tournamentData.id,
      }
    );
  } else {
    // 3b. For regular rounds, all players in the tournament are potentially eligible
    eligiblePlayersForToday = tournamentData.playersList.map((player) => ({
      name: player.name,
      email: player.email,
      conference: player.conference,
      division: player.group,
      team: player.team,
    })) as unknown as IOpponents[];
  }

  // 4. Filter eligible players to find opponents (not self, haven't played today)
  // Note: The check for playersWhoPlayedToday is technically redundant here now because we already filtered the requesting player,
  // but it doesn't hurt to leave it for clarity or if eligiblePlayersForToday logic changes.
  const potentialOpponents = eligiblePlayersForToday.filter((player) => {
    const isNotSelf = player.email !== requestingPlayer.email;
    const hasNotPlayedToday = !playersWhoPlayedToday.has(player.email || ""); // Ensure opponent hasn't played either
    return isNotSelf && hasNotPlayedToday;
  });

  logger.info(
    `Potential Dogfight opponents found: ${potentialOpponents.map(
      (p) => p.email
    )}`,
    {
      leagueId: tournamentData.id,
    }
  );

  // 5. Map to the required output format (already done in step 4)
  return potentialOpponents; // Return the filtered list
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
  if (
    !userEmail ||
    typeof userEmail !== "string" ||
    !emailRegex.test(userEmail)
  ) {
    return res.status(400).json({
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
      return res.status(404).json({
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
        opponents = await findDogfightOpponents(
          db,
          requestingPlayer,
          tournamentData
        );
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

    const maximumOpponents = tournamentData.matchesPerRound.map((match) => {
      const newPlayers = match === "double" ? 3 : match === "triple" ? 4 : 5;
      return newPlayers;
    });
    return res.status(200).json({
      status: "success",
      data: {
        opponents,
        maximumOpponents,
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

import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import { ITournament } from "../types/DashboardLeagues";
import { Score } from "../types/Match";
import { calculateHandicapDistribution } from "./calculateHandicapDistribution";
import { getCourseDetail } from "./courses";
import { getFormattedDate } from "./getFormattedDate";

interface CreateMultiPlayerMatchParams {
  tournament: ITournament;
  scores: Score[];
  course: string;
  teeBox: string;
  courseDisplayName: string;
  teeBoxDisplayName: string;
  authorEmail: string;
  round: number | null;
  message: string;
}

interface CreateMultiPlayerMatchResult {
  matchId: string;
  scoresData: Map<string, { scoreId: string; score: Score }>;
}

/**
 * Create a match for teamplay/dogfight/derby where all players play together
 * This differs from regular matches where it's 1v1
 */
export const createMultiPlayerMatch = async (
  params: CreateMultiPlayerMatchParams
): Promise<CreateMultiPlayerMatchResult> => {
  const {
    tournament,
    scores,
    course,
    teeBox,
    courseDisplayName,
    teeBoxDisplayName,
    authorEmail,
    round,
  } = params;

  const db = admin.firestore();
  const { formattedDate, timeZoneDate } = getFormattedDate();

  logger.info("Creating multi-player match", {
    tournamentType: tournament.tournamentType,
    playersCount: scores.length,
    round,
    structuredData: true,
  });

  // Calculate handicaps for ALL players together
  const playersHandicap = scores.map((p) => p.handicap);
  const minHcp = Math.min(...playersHandicap);
  const courseDetail = getCourseDetail(teeBox);
  const isdifferentCourse = [...courseDetail.hcp].slice(0, 9).includes(10);
  const differenceHP = playersHandicap.map((p) => p - minHcp);

  // Set handicap distribution for each player
  scores.forEach((score, index) => {
    const handicapDistribution = calculateHandicapDistribution(
      differenceHP[index],
      courseDetail.hcp,
      isdifferentCourse,
      score.handicap
    );
    score.scoreHolesHP = handicapDistribution.scoreHolesHP;
    score.teamScoreHolesHP = handicapDistribution.teamScoreHolesHP;
  });

  // Create scores in database
  const scoresId = new Map<string, { scoreId: string; score: Score }>();
  for (const score of scores) {
    const scoreRef = db.collection("score").doc();
    const id = await scoreRef.set(score).then(() => scoreRef.id);
    scoresId.set(score.idPlayer, { scoreId: id, score: score });
  }

  logger.info("Created scores for multi-player match", {
    scoresCount: scoresId.size,
    structuredData: true,
  });

  // Determine if this is teamplay (uses teamPoints), derby, or dogfight
  const isTeamplay = tournament.tournamentType === "teamplay";
  const isDerby = tournament.tournamentType === "derby";
  const winner = isTeamplay 
    ? "Teamplay Round" 
    : isDerby 
    ? "Derby Round" 
    : "Dogfight Round";

  // Update players WITHOUT specific opponent (it's a group match)
  for (const score of scores) {
    const playerQuery = db
      .collection("player")
      .where("tournamentId", "==", tournament.id)
      .where("email", "==", score.idPlayer)
      .limit(1);

    const playerSnapshot = await playerQuery.get();
    if (playerSnapshot.empty) {
      logger.warn(
        `Player data not found for update. Player ID: ${score.idPlayer}, Tournament ID: ${tournament.id}`
      );
      continue;
    }

    const playerData = playerSnapshot.docs[0].data();
    const updateData = {
      opponent: [...playerData.opponent, ""], // No specific opponent in multi-player
      pointsMatch: [...playerData.pointsMatch, 0], // No match points in teamplay/dogfight
      pointsStroke: [...playerData.pointsStroke, 0], // No stroke points
      pointsTeam: [
        ...playerData.pointsTeam,
        isTeamplay ? score.teamPoints.reduce((a, b) => a + b, 0) : 0,
      ],
      scoreId: [...playerData.scoreId, scoresId.get(score.idPlayer)?.scoreId],
      gross: [...playerData.gross, score.totalGross],
      handicap: [...playerData.handicap, score.handicap],
      net: [...playerData.net, score.totalNet],
      date: playerData.date
        ? [...playerData.date, formattedDate]
        : [formattedDate],
    };

    const playerRef = db.collection("player").doc(playerSnapshot.docs[0].id);
    await playerRef.update(updateData);
  }

  logger.info("Updated all players for multi-player match", {
    playersCount: scores.length,
    structuredData: true,
  });

  // Create ONE match with ALL players
  const matchId = db.collection("match").doc().id;
  const matchObject = {
    author: authorEmail,
    course: course,
    courseDisplayName: courseDisplayName,
    date: timeZoneDate,
    id: matchId,
    // Only include round if it was calculated (teamplay/dogfight)
    ...(round !== null && { round: round }),
    matchResults: scores.map((score) => ({
      gross: score.totalGross,
      hcp: score.handicap,
      idPlayer: score.idPlayer,
      isWinnerMatch: false, // No winner in teamplay/dogfight
      isWinnerMedalPlay: false,
      playerName: score.player,
      score: score.totalNet,
      teamPoints: score.teamPoints.reduce((a, b) => a + b, 0),
    })),
    scoresId: scores.map((score) => scoresId.get(score.idPlayer)?.scoreId),
    teeBox: teeBox,
    teeBoxDisplayName: teeBoxDisplayName,
    tournamentId: tournament.id,
    winner: winner,
  };

  await db.collection("match").doc(matchId).set(matchObject);

  logger.info("Created multi-player match successfully", {
    matchId,
    round,
    structuredData: true,
  });

  return {
    matchId,
    scoresData: scoresId,
  };
};


import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import { ITournament } from "../types/DashboardLeagues";
import { Score } from "../types/Match";
import { searchMatch } from "./searchMatch";
import { calculateHandicapDistribution } from "./calculateHandicapDistribution";
import { getCourseDetail } from "./courses";
import { getFormattedDate } from "./getFormattedDate";
import { calculateNewWinners } from "./calculateWinnersMatch";

interface CreateIndividualMatchesParams {
  tournament: ITournament;
  scores: Score[];
  course: string;
  teeBox: string;
  courseDisplayName: string;
  teeBoxDisplayName: string;
  authorEmail: string;
  message: string;
}

interface IndividualMatch {
  tournamentId: string;
  scores: Score[];
  course: string;
  teeBox: string;
  courseDisplayName: string;
  teeBoxDisplayName: string;
  message: string;
}

export interface IndividualMatchDetail {
  matchId: string;
  scores: Score[];
  winner: string;
  winByHole: string[];
}

export interface CreateIndividualMatchesResult {
  matchesId: string[];
  matchDetails: IndividualMatchDetail[];
}

/**
 * Convert a request with multiple scores into individual 1v1 matches
 * Author plays against each opponent separately
 */
const convertRequestIntoMatches = (
  scores: Score[],
  authorEmail: string,
  tournament: ITournament,
  course: string,
  teeBox: string,
  courseDisplayName: string,
  teeBoxDisplayName: string,
  message: string
): IndividualMatch[] => {
  const [authorScore] = scores.filter(
    (score) => score.idPlayer === authorEmail
  );
  const otherScores = scores.filter((score) => score.idPlayer !== authorEmail);

  return otherScores.map((score) => ({
    tournamentId: tournament.id || "",
    scores: [authorScore, score],
    course,
    teeBox,
    courseDisplayName,
    teeBoxDisplayName,
    message,
  }));
};

/**
 * Create individual 1v1 matches (for league, matchPlay, strokePlay)
 * This is the original logic where author plays against each opponent separately
 */
export const createIndividualMatches = async (
  params: CreateIndividualMatchesParams
): Promise<CreateIndividualMatchesResult> => {
  const {
    tournament,
    scores,
    course,
    teeBox,
    courseDisplayName,
    teeBoxDisplayName,
    authorEmail,
    message,
  } = params;

  const db = admin.firestore();
  const { formattedDate, timeZoneDate } = getFormattedDate();

  logger.info("Creating individual 1v1 matches", {
    tournamentType: tournament.tournamentType,
    playType: tournament.playType,
    matchCount: scores.length - 1,
    structuredData: true,
  });

  const matches = convertRequestIntoMatches(
    scores,
    authorEmail,
    tournament,
    course,
    teeBox,
    courseDisplayName,
    teeBoxDisplayName,
    message
  );

  const matchesId: string[] = [];
  const matchDetails: IndividualMatchDetail[] = [];
  const pointsPerWin = tournament.pointsPerWin;
  const pointsPerTie = tournament.pointsPerTie;
  const pointsPerWinMedal = tournament.pointsPerWinMedal;
  const pointsPerTieMedal = tournament.pointsPerTieMedal;
  const tournamentType = tournament.tournamentType;
  const playType = tournament.playType;

  for (const match of matches) {
    const { tournamentId, scores: matchScores } = match;
    const playerIdsForSearch = matchScores.map((score) => score.idPlayer);

    // Check if match already exists
    const existingMatches = await searchMatch(
      tournamentId,
      playerIdsForSearch,
      authorEmail
    );

    if (existingMatches && existingMatches.length > 0) {
      logger.info("Conflict: Similar match already exists.", {
        tournamentId,
        players: playerIdsForSearch,
        foundMatches: existingMatches,
        structuredData: true,
      });
      throw new Error(
        "Already exists a match with the same players or characteristics."
      );
    }

    // Calculate handicaps for this 1v1 match
    const playersHandicap = matchScores.map((p) => p.handicap);
    const minHcp = Math.min(...playersHandicap);
    const courseDetail = getCourseDetail(teeBox);
    const isdifferentCourse = [...courseDetail.hcp].slice(0, 9).includes(10);
    const differenceHP = playersHandicap.map((p) => p - minHcp);

    matchScores.forEach((score, index) => {
      const handicapDistribution = calculateHandicapDistribution(
        differenceHP[index],
        courseDetail.hcp,
        isdifferentCourse,
        score.handicap
      );
      score.scoreHolesHP = handicapDistribution.scoreHolesHP;
      score.teamScoreHolesHP = handicapDistribution.teamScoreHolesHP;
    });

    // Create Scores
    const scoresId = new Map<string, { scoreId: string; score: Score }>();
    for (const score of matchScores) {
      const scoreRef = db.collection("score").doc();
      const id = await scoreRef.set(score).then(() => scoreRef.id);
      scoresId.set(score.idPlayer, { scoreId: id, score: score });
    }

    // Calculate Winners
    const scoresForWinnerCalculation = Array.from(scoresId.values()).map(
      (item) => ({
        score: item.score,
      })
    );

    const {
      calculatedMatchWinner,
      calculatedWinnerMedalPlay,
      calculatedWinnerMatch,
      calculatedWinByHole,
    } = calculateNewWinners(
      {
        tournamentType,
        playType,
      },
      [scoresForWinnerCalculation[0], scoresForWinnerCalculation[1]]
    );

    // Update Players with ScoresId
    const getPointsMatch = (score: Score) => {
      return calculatedWinnerMatch.length > 1
        ? pointsPerTie
        : calculatedWinnerMatch.includes(score.idPlayer)
        ? pointsPerWin
        : 0;
    };

    const getPointsStroke = (score: Score, opponent: Score) => {
      return score.totalNet === opponent.totalNet
        ? pointsPerTieMedal
        : score.totalNet < opponent.totalNet
        ? pointsPerWinMedal
        : 0;
    };

    for (const score of matchScores) {
      const opponent = matchScores.find((s) => s.idPlayer !== score.idPlayer);

      const playerQuery = db
        .collection("player")
        .where("tournamentId", "==", tournamentId)
        .where("email", "==", score.idPlayer)
        .limit(1);

      const playerSnapshot = await playerQuery.get();
      if (playerSnapshot.empty) {
        logger.warn(
          `Player data not found for update. Player ID: ${score.idPlayer}, Tournament ID: ${tournamentId}`
        );
        continue;
      }

      const playerData = playerSnapshot.docs[0].data();
      const updateData = {
        opponent: [...playerData.opponent, opponent?.idPlayer],
        pointsMatch: [...playerData.pointsMatch, getPointsMatch(score)],
        pointsStroke: [
          ...playerData.pointsStroke,
          opponent ? getPointsStroke(score, opponent) : 0,
        ],
        pointsTeam: [
          ...playerData.pointsTeam,
          score.teamPoints.reduce((a, b) => a + b, 0),
        ],
        scoreId: [
          ...playerData.scoreId,
          scoresId.get(score.idPlayer)?.scoreId,
        ],
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

    // Create Match
    const matchId = db.collection("match").doc().id;
    const matchObject = {
      author: authorEmail,
      course: course,
      courseDisplayName: courseDisplayName,
      date: timeZoneDate,
      id: matchId,
      matchResults: matchScores.map((score) => {
        return {
          gross: score.totalGross,
          hcp: score.handicap,
          idPlayer: score.idPlayer,
          isWinnerMatch: calculatedWinnerMatch.includes(score.idPlayer),
          isWinnerMedalPlay: calculatedWinnerMedalPlay.includes(
            score.idPlayer
          ),
          playerName: score.player,
          score: score.totalNet,
          teamPoints: score.teamPoints.reduce((a, b) => a + b, 0),
        };
      }),
      scoresId: matchScores.map(
        (score) => scoresId.get(score.idPlayer)?.scoreId
      ),
      teeBox: teeBox,
      teeBoxDisplayName: teeBoxDisplayName,
      tournamentId: tournamentId,
      winner: calculatedMatchWinner,
    };

    await db.collection("match").doc(matchId).set(matchObject);
    matchesId.push(matchId);
    matchDetails.push({
      matchId,
      scores: matchScores,
      winner: calculatedMatchWinner,
      winByHole: calculatedWinByHole,
    });

    logger.info("Created individual match", {
      matchId,
      players: playerIdsForSearch,
      winner: calculatedMatchWinner,
      structuredData: true,
    });
  }

  return { matchesId, matchDetails };
};


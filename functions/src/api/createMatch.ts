import { Response } from "express";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import { RequestCreateMatch, Score } from "../types/Match";
import { searchMatch } from "../helpers/searchMatch";
import { getBodyMail } from "../helpers/getBodyMail";
import { calculateNewWinners } from "../helpers/calculateWinnersMatch";
import { sendMail } from "./sendMail";
import { ITournament } from "../types/DashboardLeagues";
import { calculateHandicapDistribution } from "../helpers/calculateHandicapDistribution";
import { getCourseDetail } from "../helpers/courses";
import { getFormattedDate } from "../helpers/getFormattedDate";

export const createMatch = async (req: RequestCreateMatch, res: Response) => {
  logger.info("Creating match", req.body, { structuredData: true });
  const db = admin.firestore();
  const {
    tournamentId,
    scores,
    author,
    course,
    teeBox,
    courseDisplayName,
    teeBoxDisplayName,
    message,
  } = req.body;
  try {
    if (scores.length !== 2) {
      return res.status(400).json({
        status: "error",
        message: "The number of players must be 2.",
      });
    }
    const fullAuthorQuery = await db
      .collection("users")
      .where("id", "==", author)
      .get();
    if (fullAuthorQuery.empty) {
      logger.warn("Author not found during match creation:", author);
      return res.status(404).json({
        status: "error",
        message: "Usuario autor no encontrado.",
      });
    }
    const fullAuthor = fullAuthorQuery.docs[0].data();

    const playerIdsForSearch = scores.map((score) => score.idPlayer);
    const existingMatches = await searchMatch(
      tournamentId,
      playerIdsForSearch,
      fullAuthor.email
    );
    if (existingMatches && existingMatches.length > 0) {
      logger.info("Conflict: Similar match already exists.", {
        tournamentId,
        players: playerIdsForSearch,
        foundMatches: existingMatches,
        structuredData: true,
      });
      return res.status(404).json({
        status: "error",
        message:
          "Already exists a match with the same players or characteristics.",
        data: {
          existingMatches: existingMatches,
        },
      });
    }

    const { formattedDate, timeZoneDate } = getFormattedDate();
    //get tournament
    const tournamentRef = db
      .collection("tournament")
      .where("id", "==", tournamentId)
      .limit(1);
    const tournamentSnapshot = await tournamentRef.get();
    if (tournamentSnapshot.empty) {
      logger.error("Tournament not found:", tournamentId);
      return res
        .status(404)
        .json({ status: "error", message: "Tournament not found" });
    }
    const tournament = tournamentSnapshot.docs[0].data() as ITournament;
    const pointsPerWin = tournament.pointsPerWin;
    const pointsPerTie = tournament.pointsPerTie;
    const pointsPerWinMedal = tournament.pointsPerWinMedal;
    const pointsPerTieMedal = tournament.pointsPerTieMedal;
    const tournamentType = tournament.tournamentType;
    const playType = tournament.playType;
    const currentTournament = tournament.name;
    const playersList = tournament.playersList;

    // Create Scores
    const playersHandicap = scores.map((p) => p.handicap);
    const minHcp = Math.min(...playersHandicap);
    const courseDetail = getCourseDetail(teeBox);

    const isdifferentCourse = [...courseDetail.hcp].slice(0, 9).includes(10);
    const differenceHP = playersHandicap.map((p) => p - minHcp);
    scores.map((score, index) => {
      const handicapDistribution = calculateHandicapDistribution(
        differenceHP[index],
        courseDetail.hcp,
        isdifferentCourse,
        score.handicap
      );
      score.scoreHolesHP = handicapDistribution.scoreHolesHP;
      score.teamScoreHolesHP = handicapDistribution.teamScoreHolesHP;
    });

    const scoresId = new Map<string, { scoreId: string; score: Score }>();
    for (const score of scores) {
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
      calculatedWinByHole,
      calculatedMatchWinner,
      calculatedWinnerMedalPlay,
      calculatedWinnerMatch,
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
    for (const score of scores) {
      const opponent = scores.find((s) => s.idPlayer !== score.idPlayer);

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
        return;
      }
      const updateData = {
        opponent: [
          ...playerSnapshot.docs[0].data().opponent,
          opponent?.idPlayer,
        ],
        pointsMatch: [
          ...playerSnapshot.docs[0].data().pointsMatch,
          getPointsMatch(score),
        ],
        pointsStroke: [
          ...playerSnapshot.docs[0].data().pointsStroke,
          opponent ? getPointsStroke(score, opponent) : 0,
        ],
        pointsTeam: [
          ...playerSnapshot.docs[0].data().pointsTeam,
          score.teamPoints.reduce((a, b) => a + b, 0),
        ],
        scoreId: [
          ...playerSnapshot.docs[0].data().scoreId,
          scoresId.get(score.idPlayer)?.scoreId,
        ],
        gross: [...playerSnapshot.docs[0].data().gross, score.totalGross],
        handicap: [...playerSnapshot.docs[0].data().handicap, score.handicap],
        net: [...playerSnapshot.docs[0].data().net, score.totalNet],
        date: playerSnapshot.docs[0].data().date
          ? [...playerSnapshot.docs[0].data().date, formattedDate]
          : [formattedDate],
      };

      const playerRef = db.collection("player").doc(playerSnapshot.docs[0].id);
      await playerRef.update(updateData);
    }
    // Create Matches
    const matchId = db.collection("match").doc().id;
    const matchObject = {
      author: author,
      course: course,
      courseDisplayName: courseDisplayName,
      date: timeZoneDate,
      id: "",
      matchResults: scores.map((score) => {
        return {
          gross: score.totalGross,
          hcp: score.handicap,
          idPlayer: score.idPlayer,
          isWinnerMatch: calculatedWinnerMatch.includes(score.idPlayer),
          isWinnerMedalPlay: calculatedWinnerMedalPlay.includes(score.idPlayer),
          playerName: score.player,
          score: score.totalNet,
          teamPoints: score.teamPoints.reduce((a, b) => a + b, 0),
        };
      }),
      scoresId: scores.map((score) => scoresId.get(score.idPlayer)?.scoreId),
      teeBox: teeBox,
      teeBoxDisplayName: teeBoxDisplayName,
      tournamentId: tournamentId,
      winner: calculatedMatchWinner,
    };
    await db.collection("match").doc(matchId).set(matchObject);

    // Send Mail
    const hideTeam =
      tournamentType !== "leagueteamplay" && tournamentType !== "teamplay";
    const hideMatch =
      playType !== "matchPlay" && playType !== "matchstrokePlay";
    const hideMedal =
      playType !== "strokePlay" &&
      playType !== "matchstrokePlay" &&
      playType !== "stableford";

    const players = Array.from(scoresId.values()).map((score) => score.score);
    const result = getBodyMail(
      players,
      calculatedWinByHole,
      hideTeam,
      calculatedMatchWinner,
      hideMatch,
      hideMedal
    );

    const player1 = players[0].player;
    const player2 = players[1].player;
    const title = `${player1} vs ${player2}`;
    const bodyMail = `<p>We just posted this result:</p> <p style="margin:0;">${currentTournament}</p><p style="margin:0;">${courseDisplayName}</p><div></div><p></p>${result}<div>${message}</div>`;
    const emails = playersList
      .map((player) => player.email)
      .filter((email): email is string => email !== undefined);
    sendMail(emails, title, bodyMail);
    return res.status(200).send({
      status: "success",
      message: "Match created successfully",
      data: {
        matchId: matchId,
      },
    });
  } catch (error: unknown) {
    logger.error("Error in createMatch handler:", error, {
      structuredData: true,
    });
    return res.status(500).json({
      status: "error",
      message: "Ocurrió un error procesando la solicitud.",
    });
  }
};

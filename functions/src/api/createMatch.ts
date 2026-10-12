import { Response } from "express";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import * as dayjs from "dayjs";
import { RequestCreateMatch } from "../types/Match";
import { ITournament } from "../types/DashboardLeagues";
import { calculateRoundForDate } from "../helpers/calculateRoundForDate";
import { createMultiPlayerMatch } from "../helpers/createMultiPlayerMatch";
import { createIndividualMatches } from "../helpers/createIndividualMatches";
import { getBodyMail } from "../helpers/getBodyMail";
import { getDerbyBodyMail } from "../helpers/getDerbyBodyMail";
import { getPlayersTeamListHTML } from "../helpers/getPlayersTeamListHTML";
import { sendMail } from "./sendMail";

export const createMatch = async (req: RequestCreateMatch, res: Response) => {
  logger.info("Creating match", req.body, { structuredData: true });
  const db = admin.firestore();
  const {
    author,
    tournamentId,
    scores,
    course,
    teeBox,
    courseDisplayName,
    teeBoxDisplayName,
    message,
  } = req.body;

  try {
    // 1. Get and validate author
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

    // 2. Get tournament to determine type and rules
    const tournamentRef = db
      .collection("tournament")
      .where("id", "==", tournamentId)
      .limit(1);

    const tournamentSnapshot = await tournamentRef.get();

    if (tournamentSnapshot.empty) {
      logger.error("Tournament not found:", tournamentId);
      return res.status(404).json({
        status: "error",
        message: "Tournament not found",
      });
    }

    const tournament = tournamentSnapshot.docs[0].data() as ITournament;

    // 3. Determine tournament type
    const isTeamplay = tournament.tournamentType === "teamplay";
    const isDogfight = tournament.tournamentType === "dogfight";
    const isDerby = tournament.tournamentType === "derby";
    const isMultiPlayerMatch = isTeamplay || isDogfight || isDerby;

    logger.info("Match type determined", {
      tournamentType: tournament.tournamentType,
      playType: tournament.playType,
      isMultiPlayerMatch,
      structuredData: true,
    });

    // 4. Calculate round ONLY for teamplay/dogfight
    let calculatedRound: number | null = null;
    if (isMultiPlayerMatch) {
      const currentDate = dayjs();
      calculatedRound = calculateRoundForDate(tournament, currentDate);

      logger.info("Round calculated for multi-player match", {
        round: calculatedRound,
        currentDate: currentDate.format(),
        structuredData: true,
      });
    }

    let matchesId: string[] = [];

    // 5. Apply logic based on tournament type
    if (isMultiPlayerMatch) {
      // ✅ TEAMPLAY/DOGFIGHT: All players in ONE match
      logger.info("Creating multi-player match", {
        tournamentType: tournament.tournamentType,
        playersCount: scores.length,
        round: calculatedRound,
        structuredData: true,
      });

      const result = await createMultiPlayerMatch({
        tournament,
        scores,
        course,
        teeBox,
        courseDisplayName,
        teeBoxDisplayName,
        authorEmail: fullAuthor.email,
        round: calculatedRound,
        message,
      });

      matchesId.push(result.matchId);

      // Send email specific to teamplay/dogfight/derby
      const hideTeam = false; // Show team info for teamplay
      const hideMatch = true; // No match winner
      const hideMedal = true; // No medal winner

      const players = Array.from(result.scoresData.values()).map(
        (item) => item.score
      );

      const bodyMailContent = isDerby
        ? getDerbyBodyMail(
            players,
            "", // No winner in Derby
            hideMatch,
            hideMedal
          )
        : getBodyMail(
            players,
            [], // No win by hole in teamplay/dogfight
            hideTeam,
            "", // No winner
            hideMatch,
            hideMedal
          );

      // Generar listado de jugadores con equipos (solo para teamplay/leagueteamplay)
      const playersTeamList = getPlayersTeamListHTML(players, tournament);

      const title = `${tournament.name} Scorecard`;
      const bodyMail = `<p>We just posted this result:</p> <p style="margin:0;">${tournament.name}</p><p style="margin:0;">${courseDisplayName}</p><div></div><p></p>${bodyMailContent}${playersTeamList}<div>${message}</div>`;

      const emails = tournament.playersList
        .map((player) => player.email)
        .filter((email): email is string => email !== undefined);

      sendMail(emails, title, bodyMail);
    } else {
      // ✅ LEAGUE/INDIVIDUAL: Split into 1v1 matches
      logger.info("Creating individual 1v1 matches", {
        tournamentType: tournament.tournamentType,
        playType: tournament.playType,
        matchCount: scores.length - 1,
        structuredData: true,
      });

      try {
        const { matchesId: createdMatchesId, matchDetails } =
          await createIndividualMatches({
            tournament,
            scores,
            course,
            teeBox,
            courseDisplayName,
            teeBoxDisplayName,
            authorEmail: fullAuthor.email,
            message,
          });

        matchesId = createdMatchesId;

        const emails = tournament.playersList
          .map((player) => player.email)
          .filter((email): email is string => email !== undefined);

        const tournamentType = tournament.tournamentType;
        const playType = tournament.playType;

        const hideTeam =
          tournamentType !== "leagueteamplay" &&
          tournamentType !== "teamplay";
        const hideMatch =
          playType !== "matchPlay" && playType !== "matchstrokePlay";
        const hideMedal =
          playType !== "strokePlay" &&
          playType !== "matchstrokePlay" &&
          playType !== "stableford";

        for (const matchDetail of matchDetails) {
          const bodyMailContent = getBodyMail(
            matchDetail.scores,
            matchDetail.winByHole,
            hideTeam,
            matchDetail.winner,
            hideMatch,
            hideMedal
          );

          const playersTeamList = getPlayersTeamListHTML(
            matchDetail.scores,
            tournament
          );

          const player1 = matchDetail.scores[0]?.player ?? "";
          const player2 = matchDetail.scores[1]?.player ?? "";
          const title = `${player1} vs ${player2}`;
          const bodyMail = `<p>We just posted this result:</p><p style="margin:0;">${tournament.name}</p><p style="margin:0;">${courseDisplayName}</p><div></div><p></p>${bodyMailContent}${playersTeamList}<div>${message}</div>`;

          sendMail(emails, title, bodyMail);
        }
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes("Already exists a match")
        ) {
          return res.status(409).json({
            status: "error",
            message: error.message,
          });
        }
        throw error;
      }
    }

    return res.status(200).send({
      status: "success",
      message: "Match created successfully",
      data: {
        matchId: matchesId,
        ...(calculatedRound !== null && { round: calculatedRound }),
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

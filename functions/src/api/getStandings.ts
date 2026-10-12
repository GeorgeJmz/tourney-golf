import { Response } from "express";
import admin = require("firebase-admin");
import * as logger from "firebase-functions/logger";
import { RequestGetStandings } from "../types/Standings";
import { createStatistics } from "../helpers/createStatistics";
import { calculateTeamPointsStandings } from "../helpers/calculateTeamPointsStandings";
import { calculateDerbyStandings } from "../helpers/calculateDerbyStandings";
import { ITournament } from "../types/DashboardLeagues";
export const getStandings = async (req: RequestGetStandings, res: Response) => {
  const db = admin.firestore();
  const { leagueId } = req.body;

  if (!leagueId || typeof leagueId !== "string") {
    return res.status(400).json({ error: "Invalid leagueId" });
  }

  try {
    const [statisticsSnapshot, tournamentSnapshot] = await Promise.all([
      db.collection("statistics").doc(leagueId).get(),
      db.collection("tournament").where("id", "==", leagueId).get(),
    ]);

    let statistics = (await !statisticsSnapshot.exists)
      ? await createStatistics(leagueId)
      : statisticsSnapshot.data();

    logger.info("statistics", { structuredData: statistics });
    if (!statistics) {
      return res
        .status(404)
        .json({ error: "No statistics found for this league" });
    }

    const isDogFight = statistics.tournamentType === "dogfight";
    const isDerby = statistics.tournamentType === "derby";
    const isTeamPlay = statistics.tournamentType === "teamplay";

    // Para Derby, calcular standings basados en la etapa/round actual
    if (isDerby) {
      const derbyStandings = await calculateDerbyStandings(leagueId);
      logger.info("derbyStandings", { structuredData: derbyStandings });

      const standingsPositions = derbyStandings
        .slice(0, 3)
        .map((player, index) => ({
          name: player.tourneyName,
          points: player.bestNet.toString(),
          position: index + 1,
        }));

      // isPlayoffsActive check para Derby
      let isPlayoffsActive = false;
      try {
        if (!tournamentSnapshot.empty) {
          const tournament = tournamentSnapshot.docs[0].data() as ITournament & {
            playOffsStartDate?: unknown;
            playOffsCutOff?: unknown;
          };
          isPlayoffsActive =
            typeof tournament.playOffsStartDate !== "undefined" &&
            tournament.playOffsStartDate !== null &&
            typeof tournament.playOffsCutOff !== "undefined" &&
            tournament.playOffsCutOff !== null;
        }
      } catch (e) {
        logger.warn("Unable to read playoffs fields", { error: e });
      }

      return res.status(200).json({
        status: "success",
        data: {
          standings: standingsPositions,
          isPlayoffsActive,
        },
      });
    }

    const sortedPlayers = (!isTeamPlay
      ? statistics.players
      : await calculateTeamPointsStandings(
          statistics.players,
          leagueId
        )) as Array<{
      tourneyName: string;
      netAverage: number;
      totalPoints: number;
      medalPoints: number;
      totalGross?: number;
      totalNet?: number;
    }>;

    logger.info("sortedPlayers", { structuredData: statistics.players });
    logger.info("isDogFight", { structuredData: statistics.tournamentType });
    
    const standingsPositions = sortedPlayers
      .slice(0, 3)
      .map((player: { tourneyName: string; netAverage: number; totalPoints: number; medalPoints: number; totalGross?: number; totalNet?: number }, index: number) => ({
        name: player.tourneyName,
        points: isDogFight
          ? player.netAverage.toString()
          : player.totalPoints.toString(),
        position: index + 1,
      }));

    // isPlayoffsActive solo si existen ambos campos en tournament
    let isPlayoffsActive = false;
    try {
      if (!tournamentSnapshot.empty) {
        const tournament = tournamentSnapshot.docs[0].data() as ITournament & {
          playOffsStartDate?: unknown;
          playOffsCutOff?: unknown;
        };
        isPlayoffsActive =
          typeof tournament.playOffsStartDate !== "undefined" &&
          tournament.playOffsStartDate !== null &&
          typeof tournament.playOffsCutOff !== "undefined" &&
          tournament.playOffsCutOff !== null;
      }
    } catch (e) {
      logger.warn("Unable to read playoffs fields", { error: e });
    }

    return res.status(200).json({
      status: "success",
      data: {
        standings: standingsPositions,
        isPlayoffsActive,
      },
    });
  } catch (error) {
    logger.error("Error fetching standings", { error });
    return res
      .status(500)
      .json({ error: "We found an error fetching your request!" });
  }
};

import { Response } from "express";
import admin = require("firebase-admin");
import * as logger from "firebase-functions/logger";
import { RequestGetStandings } from "../types/Standings";
import { createStatistics } from "../helpers/createStatistics";

export const getStandings = async (req: RequestGetStandings, res: Response) => {
  const db = admin.firestore();
  const { leagueId } = req.body;

  if (!leagueId || typeof leagueId !== "string") {
    return res.status(400).json({ error: "Invalid leagueId" });
  }

  try {
    const [tournamentsSnapshot] = await Promise.all([
      db.collection("statistics").doc(leagueId).get(),
    ]);

    const statistics = (await !tournamentsSnapshot.exists)
      ? await createStatistics(leagueId)
      : tournamentsSnapshot.data();

    logger.info("statistics", { structuredData: statistics });
    if (!statistics) {
      return res
        .status(404)
        .json({ error: "No statistics found for this league" });
    }

    const isDogFight = statistics.tournamentType === "dogfight";
    const isTeamPlay = statistics.tournamentType === "teamplay";
    const sortedPlayers = statistics.players;

    logger.info("sortedPlayers", { structuredData: statistics.players });
    logger.info("isDogFight", { structuredData: statistics.tournamentType });
    if (isTeamPlay) {
      return res.status(200).json({
        status: "success",
        data: {
          standings: [],
        },
      });
    }
    const standingsPositions = sortedPlayers
      .slice(0, 3)
      .map((player, index) => ({
        name: player.tourneyName,
        points: isDogFight ? player.netAverage : player.totalPoints,
        position: index + 1,
      }));

    return res.status(200).json({
      status: "success",
      data: {
        standings: standingsPositions,
      },
    });
  } catch (error) {
    logger.error("Error fetching standings", { error });
    return res
      .status(500)
      .json({ error: "We found an error fetching your request!" });
  }
};

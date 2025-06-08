import { Response } from "express";
import admin = require("firebase-admin");
import { RequestGetStats } from "../types/Stats";
import { logger } from "firebase-functions/v2";
import { createStatistics } from "../helpers/createStatistics";

export const getStats = async (req: RequestGetStats, res: Response) => {
  const db = admin.firestore();
  const { leagueId } = req.body;

  if (!leagueId || typeof leagueId !== "string") {
    return res.status(400).json({ error: "Invalid leagueId" });
  }

  try {
    const [statisticsSnapshot] = await Promise.all([
      db.collection("statistics").doc(leagueId).get(),
    ]);

    const statistics = (await !statisticsSnapshot.exists)
      ? await createStatistics(leagueId)
      : statisticsSnapshot.data();

    if (!statistics) {
      return res.status(404).json({ error: "Statistics not found" });
    }

    return res.status(200).json({
      status: "success",
      data: {
        leagueId: leagueId,
        stats: statistics.stats || {},
      },
    });
  } catch (error) {
    logger.error("Error fetching stats", { error });
    return res
      .status(500)
      .json({ error: "We found an error fetching your request!" });
  }
};

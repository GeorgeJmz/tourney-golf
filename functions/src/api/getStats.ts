import { Response } from "express";
import admin = require("firebase-admin");
import { RequestGetStats } from "../types/Stats";
import { logger } from "firebase-functions/v2";

export const getStats = async (req: RequestGetStats, res: Response) => {
  const db = admin.firestore();
  const { leagueId } = req.body;

  if (!leagueId || typeof leagueId !== "string") {
    return res.status(400).json({ error: "Invalid leagueId" });
  }
  try {
    const statisticsRef = db.collection("statistics").doc(leagueId);
    const statisticsDoc = await statisticsRef.get();
    const statistics = statisticsDoc.data();
    return res.status(200).json({
      status: "success",
      data: {
        leagueId: leagueId,
        statistics,
      },
    });
  } catch (error) {
    logger.error("Error fetching standings", { error });
    return res
      .status(500)
      .json({ error: "We found an error fetching your request!" });
  }
};
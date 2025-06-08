import { Response } from "express";
import admin = require("firebase-admin");
import { RequestGetBoard } from "../types/Board";
import { logger } from "firebase-functions/v2";
import { createStatistics } from "../helpers/createStatistics";

export const getBoard = async (req: RequestGetBoard, res: Response) => {
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

import { Response } from "express";
import admin = require("firebase-admin");
import { RequestGetStats } from "../types/Stats";
import { logger } from "firebase-functions/v2";
import { createStatistics } from "../helpers/createStatistics";

interface PlayerStats {
  player: string;
  date: string[];
  hdc: (string | number)[];
  net: number[];
  score: string[];
  points: (string | number)[];
  course: (string | number)[];
  opponent: string[];
}

interface GameStat {
  date: string;
  hdcp: number;
  netVsPar: number;
  points: number;
  opponent: string;
  scoreId: string;
  course: number;
}

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

    let stats = statistics.stats;
    const conferenceList = statistics.conferenceList;
    if (stats && typeof stats === "object") {
      const newStats: Record<string, { player: string; games: GameStat[] }[]> =
        {};
      for (const conference in stats as Record<string, PlayerStats[]>) {
        newStats[conference] = (stats as Record<string, PlayerStats[]>)[
          conference
        ].map((player: PlayerStats) => {
          const games: GameStat[] = (player.date || []).map(
            (date: string, idx: number) => ({
              date,
              hdcp: Number(player.hdc?.[idx] ?? 0),
              netVsPar: Number(player.net?.[idx] ?? 0),
              points: Number(player.points?.[idx] ?? 0),
              opponent: (player.opponent?.[idx] ?? "").trim(),
              scoreId: player.score?.[idx] ?? "",
              course: Number(player.course?.[idx] ?? 0),
            })
          );
          return {
            player: player.player,
            games,
          };
        });
      }
      stats = newStats;
    }

    return res.status(200).json({
      status: "success",
      data: {
        leagueId: leagueId,
        stats: stats || {},
        conferenceList: conferenceList || [],
      },
    });
  } catch (error) {
    logger.error("Error fetching stats", { error });
    return res
      .status(500)
      .json({ error: "We found an error fetching your request!" });
  }
};

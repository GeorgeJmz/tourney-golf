import { Response } from "express";
import admin = require("firebase-admin");
import type {
  ITournament,
  RequestGetDashboadLeagues,
} from "../types/DashboardLeagues";
import * as logger from "firebase-functions/logger";
import { UserType } from "../types/User";

const chunkArray = <T>(arr: T[], size: number): T[][] =>
  arr.length === 0
    ? []
    : [arr.slice(0, size), ...chunkArray(arr.slice(size), size)];

const queryByChunks = async (
  db: admin.firestore.Firestore,
  ids: string[]
): Promise<ITournament[]> => {
  if (ids.length === 0) { return []; }
  const chunks = chunkArray(ids, 30);
  const snapshots = await Promise.all(
    chunks.map((chunk) =>
      db.collection("tournament").where("id", "in", chunk).get()
    )
  );
  return snapshots.flatMap((snap) =>
    snap.docs.map((doc) => ({ ...(doc.data() as ITournament), uuid: doc.id }))
  );
};

export const getDashboardLeagues = async (
  req: RequestGetDashboadLeagues,
  res: Response
) => {
  const db = admin.firestore();
  const { userId } = req.body;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "Invalid userId" });
  }

  try {
    const usersSnapshot = await db
      .collection("users")
      .where("id", "==", userId)
      .get();

    if (usersSnapshot.empty) {
      return res.status(404).json({ error: "User not found" });
    }

    const currentUser = usersSnapshot.docs[0].data() as UserType;

    const activeTournamentIds = (
      (currentUser.activeTournaments as unknown as Array<string | { tournamentId: string }>) || []
    )
      .map((t) => (typeof t === "string" ? t : t.tournamentId))
      .filter(Boolean) as string[];

    const historyTournamentIds = (
      (currentUser.historyTournaments as unknown as Array<string | { tournamentId: string }>) || []
    )
      .map((t) => (typeof t === "string" ? t : t.tournamentId))
      .filter(Boolean) as string[];

    const [authorLeaguesSnapshot, activeLeagues, historyLeagues] =
      await Promise.all([
        db
          .collection("tournament")
          .where("author", "==", userId)
          .where("status", "in", ["draft", "published"])
          .get(),
        queryByChunks(db, activeTournamentIds),
        queryByChunks(db, historyTournamentIds),
      ]);

    const adminLeagues = authorLeaguesSnapshot.docs.map((doc) => ({
      ...doc.data(),
      uuid: doc.id,
    }));

    return res.status(200).json({
      status: "success",
      data: {
        activeLeagues,
        adminLeagues,
        historyLeagues,
      },
    });
  } catch (error) {
    logger.error("Error fetching dashboard leagues", { error });
    return res
      .status(500)
      .json({ error: "We found an error fetching your request!" });
  }
};

import { Response } from "express";
import admin = require("firebase-admin");
import type {
  ITournament,
  RequestGetDashboadLeagues,
} from "../types/DashboardLeagues";
import * as logger from "firebase-functions/logger";
import { UserType } from "../types/User";

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
    // Obtener el usuario
    const usersSnapshot = await db
      .collection("users")
      .where("id", "==", userId)
      .get();

    if (usersSnapshot.empty) {
      return res.status(404).json({ error: "User not found" });
    }

    const currentUser = usersSnapshot.docs[0].data() as UserType;
    const activeTournamentsList =
      currentUser.activeTournaments || ([] as string[]);
    const historyTournamentsList =
      currentUser.historyTournaments || ([] as string[]);

    // Obtener ligas del autor
    const authorLeaguesSnapshot = await db
      .collection("tournament")
      .where("author", "==", userId)
      .where("status", "in", ["draft", "published", "closed"])
      .get();

    const authorLeagues = authorLeaguesSnapshot.docs.map((doc) => ({
      ...doc.data(),
      uuid: doc.id,
    }));

    // Obtener ligas activas
    let activeLeagues = [] as ITournament[];
    if (activeTournamentsList.length > 0) {
      const activeLeaguesSnapshot = await db
        .collection("tournament")
        .where("id", "in", activeTournamentsList)
        .get();
      activeLeagues = activeLeaguesSnapshot.docs.map((doc) => ({
        ...(doc.data() as ITournament),
        uuid: doc.id,
      }));
    }

    // Obtener ligas históricas
    let historyLeagues = [] as ITournament[];
    if (historyTournamentsList.length > 0) {
      const historyLeaguesSnapshot = await db
        .collection("tournament")
        .where("id", "in", historyTournamentsList)
        .get();
      historyLeagues = historyLeaguesSnapshot.docs.map((doc) => ({
        ...(doc.data() as ITournament),
        uuid: doc.id,
      }));
    }

    return res.status(200).json({
      status: "success",
      data: {
        activeLeagues,
        adminLeagues: authorLeagues,
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

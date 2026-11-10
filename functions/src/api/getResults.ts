import { Response } from "express";
import admin = require("firebase-admin");
import { RequestGetBoard } from "../types/Board";
import { logger } from "firebase-functions/v2";
import { createStatistics } from "../helpers/createStatistics";
import { IMatch, IMatchResults } from "../types/Match";

export const getResults = async (req: RequestGetBoard, res: Response) => {
  const db = admin.firestore();
  const { leagueId } = req.body;

  if (!leagueId || typeof leagueId !== "string") {
    return res.status(400).json({ error: "Invalid leagueId" });
  }
  try {
    const [statisticsSnapshot, tournamentSnapshot] = await Promise.all([
      db.collection("statistics").doc(leagueId).get(),
      db.collection("tournament").where("id", "==", leagueId).limit(1).get(),
    ]);

    const statistics = (await !statisticsSnapshot.exists)
      ? await createStatistics(leagueId)
      : statisticsSnapshot.data();

    if (!statistics) {
      return res.status(404).json({ error: "Statistics not found" });
    }

    // Get tournament info to calculate flags
    const tournament = tournamentSnapshot.empty ? null : tournamentSnapshot.docs[0].data();
    const tournamentType = tournament?.tournamentType || statistics.tournamentType;
    const playType = tournament?.playType;
    
    // Calculate flags based on tournament type
    const isTeamPlay = tournamentType === "teamplay";
    const isDerby = tournamentType === "derby";
    const isDogfight = tournamentType === "dogfight";
    
    // hideTeam: ocultar para league, leagueteamplay, derby, dogfight (todos excepto teamplay)
    const hideTeam = tournamentType === "league" || 
                     tournamentType === "leagueteamplay" || 
                     isDerby || 
                     isDogfight;
    const hideMatch = playType === "strokePlay" || isTeamPlay;
    const hideMedal = playType === "matchPlay";
    const hideWinner = isTeamPlay;

    const results = (statistics.results || [])
      .map((match: IMatch) => {
        const scoresId = (match.scoresId || []).join("-");
        const urlDetail = `/match/${scoresId}-match-${!hideMatch}-team-${!hideTeam}-medal-${!hideMedal}-winner-${!hideWinner}-matchid-${match.id}`;
        return {
          date: match.date,
          urlDetail,
          course: match.course,
          courseDisplayName: match.courseDisplayName,
          round: match.round,
          players: (match.matchResults || []).map((player: IMatchResults) => ({
            name: player.playerName,
            gross: player.gross,
            hdcp: Number(player.hcp),
            net: player.score,
            team: player.teamPoints,
            isWinnerMatch: player.isWinnerMatch,
            isWinnerMedalPlay: player.isWinnerMedalPlay,
          })),
        };
      })
      .sort((a: { date: string | string[] }, b: { date: string | string[] }) => {
        // Ordenar de más reciente a más antiguo (descendente)
        const dateA = parseInt(a.date[0]);
        const dateB = parseInt(b.date[0]);
        return dateB - dateA; // Más nuevo primero
      });

    return res.status(200).json({
      status: "success",
      data: {
        tournamentType: statistics.tournamentType,
        results,
      },
    });
  } catch (error) {
    logger.error("Error fetching results", { error });
    return res
      .status(500)
      .json({ error: "We found an error fetching your request!" });
  }
};

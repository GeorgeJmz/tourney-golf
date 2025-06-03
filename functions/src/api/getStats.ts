import { Response } from "express";
import admin = require("firebase-admin");
import { RequestGetStats } from "../types/Stats";
import { logger } from "firebase-functions/v2";
import { getCourseDetail } from "../helpers/courses";
import { ITournament } from "../types/DashboardLeagues";
import { ITournamentPlayer, IUser } from "../types/Standings";
import { IMatch } from "../types/Match";

export const getStats = async (req: RequestGetStats, res: Response) => {
  const db = admin.firestore();
  const { leagueId } = req.body;

  if (!leagueId || typeof leagueId !== "string") {
    return res.status(400).json({ error: "Invalid leagueId" });
  }

  try {
    // Get tournament data
    const tournamentRef = db.collection("tournament").doc(leagueId);
    const tournamentDoc = await tournamentRef.get();
    const tournament = tournamentDoc.data() as ITournament;

    if (!tournament) {
      return res.status(404).json({ error: "Tournament not found" });
    }

    // Get all players
    const playersSnapshot = await db
      .collection("player")
      .where("tournamentId", "==", leagueId)
      .get();
    const players: ITournamentPlayer[] = playersSnapshot.docs.map(doc => ({
      ...(doc.data() as ITournamentPlayer),
      id: doc.id,
    }));

    // Get all matches
    const matchesSnapshot = await db
      .collection("match")
      .where("tournamentId", "==", leagueId)
      .get();
    const matches: IMatch[] = matchesSnapshot.docs.map(doc => ({
      ...(doc.data() as IMatch),
      id: doc.id,
    }));

    // Get player names using the same logic as createStatistics.ts
    const emails = players.map(player => player.email);
    const users: IUser[] = [];
    const chunkSize = 30;

    for (let i = 0; i < emails.length; i += chunkSize) {
      const chunk = emails.slice(i, i + chunkSize);
      const usersSnapshot = await db
        .collection("users")
        .where("email", "in", chunk)
        .get();
      usersSnapshot.forEach(doc => {
        users.push(doc.data() as IUser);
      });
    }

    const nameMap = new Map(
      users.map(user => [user.email, `${user.name} ${user.lastName}`])
    );

    const playersWithNames = players.map(player => ({
      ...player,
      name: nameMap.get(player.email) || player.name,
    }));

    // Process stats similar to getNewStats in TournamentViewModel
    const processedStats: {
      [key: string]: {
        [key: string]: Array<{
          player: string;
          date: string;
          hdc: string;
          net: number;
          score: string;
          course: number;
          points: string;
          opponent: string;
        }>;
      };
    } = {};

    matches.forEach(match => {
      match.matchResults.forEach((player, i) => {
        const id = player.idPlayer;
        const moreData = playersWithNames.find(p => p.email === id);
        const currentPosition = moreData?.scoreId.findIndex(
          s => s === match.scoresId[i]
        );
        const currentConference = moreData?.conference || "";

        const getTotalPoints = (player: {
          pointsMatch: number;
          pointsStroke: number;
          bonusPoints: number;
        }) => {
          const isLTMATCH = tournament.tournamentType === "leagueteamplay" && tournament.playType === "matchplaystableford";
          const isLTMEDAL = tournament.tournamentType === "leagueteamplay" && tournament.playType === "medalplaystableford";
          const isLMATCH = tournament.tournamentType === "league" && tournament.playType === "matchPlay";
          const isLMEDAL = tournament.tournamentType === "league" && tournament.playType === "strokePlay";

          if (isLTMATCH || isLMATCH) {
            return player.pointsMatch + player.bonusPoints;
          }
          if (isLTMEDAL || isLMEDAL) {
            return player.pointsStroke + player.bonusPoints;
          }
          return player.pointsMatch + player.pointsStroke + player.bonusPoints;
        };

        const values = {
          player: moreData?.name || "",
          date: moreData?.date ? moreData?.date[currentPosition || 0] : "",
          hdc: player.hcp,
          net: player.score - getCourseDetail(match.teeBox).par.reduce((acc, curr) => acc + curr, 0),
          score: match.scoresId[i],
          points: getTotalPoints({
            pointsMatch: moreData?.pointsMatch[currentPosition || 0] || 0,
            pointsStroke: moreData?.pointsStroke[currentPosition || 0] || 0,
            bonusPoints: moreData?.bonusPoints !== undefined ? moreData?.bonusPoints[currentPosition || 0] || 0 : 0,
          }).toString(),
          course: getCourseDetail(match.teeBox).par.reduce((acc, curr) => acc + curr, 0),
          opponent: nameMap.get(moreData?.opponent[currentPosition || 0] || "") || "",
        };

        if (!processedStats[currentConference]) {
          processedStats[currentConference] = {};
        }
        if (processedStats[currentConference][id]) {
          processedStats[currentConference][id].push(values);
        } else {
          processedStats[currentConference][id] = [values];
        }
      });
    });

    // Sort the stats similar to preprocessedStats in Stats.tsx
    const sortedStats = Object.entries(processedStats).reduce((acc, [conference, stats]) => {
      acc[conference] = Object.values(stats)
        .sort((a, b) => a[0].player.localeCompare(b[0].player))
        .map(items => items.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      return acc;
    }, {} as { [key: string]: Array<Array<{
      player: string;
      date: string;
      hdc: string;
      net: number;
      score: string;
      course: number;
      points: string;
      opponent: string;
    }>> });

    return res.status(200).json({
      status: "success",
      data: {
        leagueId,
        statistics: sortedStats,
      },
    });
  } catch (error) {
    logger.error("Error fetching standings", { error });
    return res.status(500).json({ error: "We found an error fetching your request!" });
  }
};
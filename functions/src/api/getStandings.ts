import { Response } from "express";
import admin = require("firebase-admin");
import * as logger from "firebase-functions/logger";
import {
  ITournamentPlayer,
  IUser,
  RequestGetStandings,
} from "../types/Standings";
import type { ITournament } from "../types/DashboardLeagues";

export const getStandings = async (req: RequestGetStandings, res: Response) => {
  const db = admin.firestore();
  const { leagueId } = req.body;

  if (!leagueId || typeof leagueId !== "string") {
    return res.status(400).json({ error: "Invalid leagueId" });
  }

  try {
    const tournamentsSnapshot = await db
      .collection("tournament")
      .where("id", "==", leagueId)
      .get();

    if (tournamentsSnapshot.empty) {
      return res.status(404).json({ error: "Tournament not found" });
    }

    const playersSnapshot = await db
      .collection("player")
      .where("tournamentId", "==", leagueId)
      .get();
    const currentLeague = tournamentsSnapshot.docs[0].data() as ITournament;

    const tournamentType = currentLeague.tournamentType;
    const playType = currentLeague.playType;
    const pointsPerTie = currentLeague.pointsPerTie;
    const pointsPerWin = currentLeague.pointsPerWin;
    const pointsPerTieMedal = currentLeague.pointsPerTieMedal;
    const pointsPerWinMedal = currentLeague.pointsPerWinMedal;

    const isLTMATCH =
      tournamentType === "leagueteamplay" && playType === "matchplaystableford";
    const isLTMEDAL =
      tournamentType === "leagueteamplay" && playType === "medalplaystableford";
    const isLMATCH = tournamentType === "league" && playType === "matchPlay";
    const isLMEDAL = tournamentType === "league" && playType === "strokePlay";

    const isDogFight = tournamentType === "dogfight";

    const players: ITournamentPlayer[] = [];
    playersSnapshot.forEach((doc) => {
      const player = doc.data() as ITournamentPlayer;
      players.push({
        ...doc.data(),
        id: doc.id,
      } as unknown as ITournamentPlayer);
      logger.info("player", { player });
    });

    const emails = players.map((player) => player.email);

    const users: IUser[] = [];
    const chunkSize = 30;

    for (let i = 0; i < emails.length; i += chunkSize) {
      if (i + chunkSize > emails.length) {
        const chunk = emails.slice(i);
        const usersSnapshot = await db
          .collection("users")
          .where("email", "in", chunk)
          .get();
        usersSnapshot.forEach((doc) => {
          users.push(doc.data() as IUser);
        });
      }
    }
    const nameMap = new Map(
      users.map((player) => [player.email, player.name + " " + player.lastName])
    );

    const playersWithNames = players.map((player) => ({
      ...player,
      name: nameMap.get(player.email) || player.name,
    }));

    const newPlayers = await Promise.all(
      playersWithNames.map(async (player) => {
        const getAverage = (values: Array<number>) => {
          const average = values.reduce((acc, curr) => acc + curr, 0);
          return average > 0 ? (average / values.length).toFixed(1) : "0";
        };

        const getWins = () => {
          if (isLTMATCH || isLMATCH) {
            return player.pointsMatch.reduce(
              (acc, curr) => (curr === pointsPerWin ? acc + 1 : acc),
              0
            );
          }
          if (isLTMEDAL || isLMEDAL) {
            return player.pointsStroke.reduce(
              (acc, curr) => (curr === pointsPerWinMedal ? acc + 1 : acc),
              0
            );
          }
          return (
            player.pointsMatch.reduce(
              (acc, curr) => (curr === pointsPerWin ? acc + 1 : acc),
              0
            ) +
            player.pointsStroke.reduce(
              (acc, curr) => (curr === pointsPerWinMedal ? acc + 1 : acc),
              0
            )
          );
        };

        const getDraws = () => {
          if (isLTMATCH || isLMATCH) {
            return player.pointsMatch.reduce(
              (acc, curr) => (curr === pointsPerTie ? acc + 1 : acc),
              0
            );
          }
          if (isLTMEDAL || isLMEDAL) {
            return player.pointsStroke.reduce(
              (acc, curr) => (curr === pointsPerTieMedal ? acc + 1 : acc),
              0
            );
          }
          return (
            player.pointsMatch.reduce(
              (acc, curr) => (curr === pointsPerTie ? acc + 1 : acc),
              0
            ) +
            player.pointsStroke.reduce(
              (acc, curr) => (curr === pointsPerTieMedal ? acc + 1 : acc),
              0
            )
          );
        };

        const getLoss = () => {
          if (isLTMATCH || isLMATCH) {
            return player.pointsMatch.reduce(
              (acc, curr) => (curr === 0 ? acc + 1 : acc),
              0
            );
          }
          if (isLTMEDAL || isLMEDAL) {
            return player.pointsStroke.reduce(
              (acc, curr) => (curr === 0 ? acc + 1 : acc),
              0
            );
          }
          return (
            player.pointsMatch.reduce(
              (acc, curr) => (curr === 0 ? acc + 1 : acc),
              0
            ) +
            player.pointsStroke.reduce(
              (acc, curr) => (curr === 0 ? acc + 1 : acc),
              0
            )
          );
        };

        const getBonusPoints = () =>
          player.bonusPoints
            ? player.bonusPoints.reduce((acc, curr) => acc + curr, 0)
            : 0;

        const getTotalPoints = () => {
          if (isLTMATCH || isLMATCH) {
            return (
              player.pointsMatch.reduce((acc, curr) => acc + curr, 0) +
              getBonusPoints()
            );
          }
          if (isLTMEDAL || isLMEDAL) {
            return (
              player.pointsStroke.reduce((acc, curr) => acc + curr, 0) +
              getBonusPoints()
            );
          }
          return (
            player.pointsMatch.reduce((acc, curr) => acc + curr, 0) +
            player.pointsStroke.reduce((acc, curr) => acc + curr, 0) +
            getBonusPoints()
          );
        };

        return {
          id: player.id,
          position: 0, // Add position property
          tourneyName: player.name, // Add tourneyName property
          matchesPlayed:
            playType !== "matchstrokePlay"
              ? player.opponent.length
              : player.opponent.length * 2,
          wins: getWins(),
          draws: getDraws(),
          losses: getLoss(),
          bonusPoints: getBonusPoints(),
          matchPoints: player.pointsMatch.reduce((acc, curr) => acc + curr, 0),
          medalPoints: player.pointsStroke.reduce((acc, curr) => acc + curr, 0),
          totalPoints: getTotalPoints(),
          grossAverage: getAverage(
            player.gross.map((value) => parseInt(value.toString()))
          ),
          handicapAverage: getAverage(
            player.handicap.map((value) => parseInt(value.toString()))
          ),
          netAverage: getAverage(
            player.net.map((value) => parseInt(value.toString()))
          ),
          teamPoints: player.pointsTeam.reduce((acc, curr) => acc + curr, 0),
          conference: player.conference,
          group: player.group,
        };
      })
    );

    const result = !isDogFight
      ? newPlayers.sort((a, b) => b.totalPoints - a.totalPoints)
      : newPlayers
          .sort((a, b) => {
            if (parseInt(a.netAverage) > 0 && parseInt(b.netAverage) > 0) {
              return parseInt(b.netAverage) - parseInt(a.netAverage);
            } else if (
              parseInt(a.netAverage) <= 0 &&
              parseInt(b.netAverage) <= 0
            ) {
              return 0;
            } else {
              return parseInt(a.netAverage) - parseInt(b.netAverage);
            }
          })
          .reverse();

    const standingsPositions = result.slice(0, 3).map((player, index) => ({
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

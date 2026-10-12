import { Response } from "express";
import admin = require("firebase-admin");
import { RequestGetBoard } from "../types/Board";
import { logger } from "firebase-functions/v2";
import { ITournament } from "../types/DashboardLeagues";
import { ITournamentPlayer } from "../types/Standings";
import { normalizeDateToMMDDYYYY } from "../helpers/normalizeDateFormat";

interface Stage {
  id: string;
  name: string;
  start: string;
  end: string;
}

interface IUser {
  email: string;
  name: string;
  lastName: string;
}

interface StageData {
  teams: {
    name: string;
    players: {
      name: string;
      points: number;
      topStagePoints: number;
    }[];
    roundsPlayed: number;
    points: number;
  }[];
}

interface StageInfo {
  id: string;
  name: string;
  start: string;
  end: string;
  data: StageData;
}

export const getTeamboard = async (req: RequestGetBoard, res: Response) => {
  const db = admin.firestore();
  const { leagueId } = req.body;

  if (!leagueId || typeof leagueId !== "string") {
    return res.status(400).json({ error: "Invalid leagueId" });
  }

  try {
    // Obtener datos del torneo
    const [tournamentSnapshot, playersSnapshot] = await Promise.all([
      db.collection("tournament").where("id", "==", leagueId).get(),
      db.collection("player").where("tournamentId", "==", leagueId).get(),
    ]);

    if (tournamentSnapshot.empty) {
      return res.status(404).json({ error: "Tournament not found" });
    }

    const tournament = tournamentSnapshot.docs[0].data() as ITournament;
    const players: ITournamentPlayer[] = playersSnapshot.docs.map((doc) => ({
      ...(doc.data() as ITournamentPlayer),
      id: doc.id,
    }));

    // Obtener nombres de usuarios
    const emails = players.map((player) => player.email);
    const users: IUser[] = [];
    const chunkSize = 30;

    for (let i = 0; i < emails.length; i += chunkSize) {
      const chunk = emails.slice(i, i + chunkSize);
      const usersSnapshot = await db
        .collection("users")
        .where("email", "in", chunk)
        .get();
      usersSnapshot.forEach((doc) => {
        users.push(doc.data() as IUser);
      });
    }

    const nameMap = new Map(
      users.map((user) => [user.email, `${user.name} ${user.lastName}`])
    );

    const playersWithNames = players.map((player) => ({
      ...player,
      name: nameMap.get(player.email) || player.name,
    }));

    // Generar stages
    const stages: Stage[] = [];
    if (tournament.stagesDates) {
      tournament.stagesDates.forEach((stage, index) => {
        stages.push({
          id: index.toString(),
          name: `Stage ${index + 1}`,
          start: normalizeDateToMMDDYYYY(stage.start),
          end: normalizeDateToMMDDYYYY(stage.end),
        });
      });
    }

    // Agregar championship stage si existe
    if (tournament.championshipDate) {
      stages.push({
        id: "champ",
        name: "Championship",
        start: normalizeDateToMMDDYYYY(tournament.championshipDate),
        end: normalizeDateToMMDDYYYY(tournament.championshipDate),
      });
    }

    // Agrupar jugadores por equipo
    const teams: { [key: string]: ITournamentPlayer[] } = {};
    playersWithNames.forEach((player) => {
      const team = player.team;
      if (!teams[team]) {
        teams[team] = [];
      }
      teams[team].push(player);
    });

    // Calcular datos de equipos para cada stage
    const stagesData: { [key: string]: StageInfo } = {};

    // Procesar cada stage
    for (const stage of stages) {
      const stageTeamsData = [];

      for (const teamId in teams) {
        const teamPlayers = teams[teamId];
        const teamName =
          tournament.teamsList?.find((t) => t.id === teamId)?.name || teamId;

        // Calcular puntos por stage para cada jugador
        const playersWithPoints = teamPlayers.map((player) => {
          const stagePoints = stages.map((stage) => {
            if (stage.id === "champ") {
              // Lógica especial para championship
              const dates = stages
                .filter((s) => s.id !== "champ")
                .map((s) => ({ start: s.start, end: s.end }));

              const pointsPerStage = dates
                .map((date) => {
                  const stagePoints: number[] = [];
                  player.pointsTeam.forEach((curr, index) => {
                    const matchDate = player.date?.[index] ?? "";
                    if (matchDate >= date.start && matchDate <= date.end) {
                      stagePoints.push(curr);
                    }
                  });
                  return stagePoints;
                })
                .flat();

              const topStagePoints = Math.max(...pointsPerStage, 0);
              const champPoints = player.pointsTeam.reduce(
                (acc, curr, index) => {
                  const matchDate = player.date?.[index] ?? "";
                  if (matchDate >= stage.start && matchDate <= stage.end) {
                    return acc > curr ? acc : curr;
                  }
                  return acc;
                },
                0
              );

              return {
                stageId: stage.id,
                points: champPoints,
                topStagePoints,
                totalPoints: topStagePoints + champPoints,
              };
            } else {
              // Lógica para stages regulares
              const points = player.pointsTeam.reduce((acc, curr, index) => {
                const matchDate = player.date?.[index] ?? "";
                if (matchDate >= stage.start && matchDate <= stage.end) {
                  return acc > curr ? acc : curr;
                }
                return acc;
              }, 0);

              return {
                stageId: stage.id,
                points,
                topStagePoints: 0,
                totalPoints: points,
              };
            }
          });

          return {
            name: player.name,
            stagePoints,
          };
        });

        // Calcular puntos totales del equipo para este stage
        const roundsPlayed = teamPlayers.reduce(
          (acc, curr) => acc + curr.pointsTeam.length,
          0
        );

        // Para championship, usar top 2 jugadores
        const isChampionship = stage.id === "champ";
        const playersForCalculation = isChampionship
          ? playersWithPoints
              .map((p, index) => ({ ...p, index }))
              .sort((a, b) => {
                const aChampPoints =
                  a.stagePoints.find((s) => s.stageId === "champ")
                    ?.totalPoints || 0;
                const bChampPoints =
                  b.stagePoints.find((s) => s.stageId === "champ")
                    ?.totalPoints || 0;
                if (aChampPoints === bChampPoints) {
                  const aTopStage = Math.max(
                    ...a.stagePoints
                      .filter((s) => s.stageId !== "champ")
                      .map((s) => s.points)
                  );
                  const bTopStage = Math.max(
                    ...b.stagePoints
                      .filter((s) => s.stageId !== "champ")
                      .map((s) => s.points)
                  );
                  return bTopStage - aTopStage;
                }
                return bChampPoints - aChampPoints;
              })
              .slice(0, 2)
          : playersWithPoints;

        const totalPoints = playersForCalculation.reduce((acc, player) => {
          const currentStagePoints = player.stagePoints.find(
            (s) => s.stageId === stage.id
          );
          return (
            acc +
            (currentStagePoints?.totalPoints || currentStagePoints?.points || 0)
          );
        }, 0);

        stageTeamsData.push({
          name: teamName,
          players: playersWithPoints.map((player) => ({
            name: player.name,
            points:
              player.stagePoints.find((s) => s.stageId === stage.id)?.points ||
              0,
            topStagePoints:
              player.stagePoints.find((s) => s.stageId === stage.id)
                ?.topStagePoints || 0,
          })),
          roundsPlayed,
          points: totalPoints,
        });
      }

      // Ordenar equipos por puntos (descendente) para este stage
      stageTeamsData.sort((a, b) => b.points - a.points);

      // Crear estructura del stage
      stagesData[
        stage.id === "champ" ? "championship" : `stage${parseInt(stage.id) + 1}`
      ] = {
        id: stage.id,
        name: stage.name,
        start: stage.start,
        end: stage.end,
        data: {
          teams: stageTeamsData,
        },
      };
    }

    return res.status(200).json({
      status: "success",
      data: {
        stages: stagesData,
      },
    });
  } catch (error) {
    logger.error("Error fetching team board", { error });
    return res
      .status(500)
      .json({ error: "We found an error fetching your request!" });
  }
};

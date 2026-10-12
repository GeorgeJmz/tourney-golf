import { Response } from "express";
import admin = require("firebase-admin");
import { RequestGetBoard } from "../types/Board";
import { logger } from "firebase-functions/v2";
import { ITournament } from "../types/DashboardLeagues";
import { ITournamentPlayer } from "../types/Standings";
import { createStatistics } from "../helpers/createStatistics";
import { normalizeDateToMMDDYYYY } from "../helpers/normalizeDateFormat";
import { IMatch } from "../types/Match";

// --- Interfaces ---
interface Stage {
  id: string;
  name: string;
  start: string;
  end: string;
}

interface StagePlayerData {
  name: string;
  team: string;
  top: number;
  pointsPerStage: string;
  // Para Derby
  bestNet?: number;
  netScores?: string;
  handicap?: number;
  course?: string;
}

interface ChampionshipPlayerData {
  name: string;
  team: string;
  total: number;
  topStage: number;
  champ: number;
  // Para Derby
  stageScores?: number[];
  champScore?: number;
  champW?: number;
  handicap?: number;
  course?: string;
}

interface PlayerCalculatedData {
  name: string;
  team: string;
  stagePerformances: { 
    [key: string]: { 
      top?: number; 
      pointsPerStage?: string;
      bestNet?: number; 
      netScores?: string; 
      handicap?: number; 
      course?: string;
    } 
  };
  topStage: number;
  champ: number;
  total: number;
  stageScoresArray?: number[];
  champScore?: number;
  champW?: number;
  champHandicap?: number;
  champCourse?: string;
}

interface StageInfo {
  id: string;
  name: string;
  start: string;
  end: string;
  data: {
    players: StagePlayerData[] | ChampionshipPlayerData[];
  };
}

export const getPlayerBoard = async (req: RequestGetBoard, res: Response) => {
  const db = admin.firestore();
  const { leagueId } = req.body;

  if (!leagueId || typeof leagueId !== "string") {
    return res.status(400).json({ error: "Invalid leagueId" });
  }

  try {
    // 1. --- Obtener datos del torneo primero para determinar el tipo ---
    const tournamentSnapshot = await db.collection("tournament").where("id", "==", leagueId).get();
    
    if (tournamentSnapshot.empty) {
      return res.status(404).json({ error: "Tournament not found" });
    }
    const tournament = tournamentSnapshot.docs[0].data() as ITournament;
    const isDerby = tournament.tournamentType?.toLowerCase() === "derby";
    const isTeamplay = tournament.tournamentType?.toLowerCase() === "teamplay";

    // 2. --- Obtener jugadores y matches según el tipo de liga ---
    let playersWithNames: ITournamentPlayer[] = [];
    let matches: IMatch[] = [];

    if (isDerby) {
      // Para Derby: consultar directamente la colección player (igual que el frontend)
      const [playersSnapshot, matchesSnapshot] = await Promise.all([
        db.collection("player").where("tournamentId", "==", leagueId).get(),
        db.collection("match").where("tournamentId", "==", leagueId).get(),
      ]);

      playersWithNames = playersSnapshot.docs.map(
        (doc) => ({ ...doc.data(), id: doc.id } as ITournamentPlayer)
      );
      matches = matchesSnapshot.docs.map((doc) => doc.data() as IMatch);

      logger.info("Derby - Usando colección player directamente", {
        numberOfPlayers: playersWithNames.length,
      });
    } else {
      // Para otras ligas: usar statistics (lógica original)
      const [statisticsSnapshot, matchesSnapshot] = await Promise.all([
        db.collection("statistics").doc(leagueId).get(),
        db.collection("match").where("tournamentId", "==", leagueId).get(),
      ]);

      let statistics = statisticsSnapshot.exists ? statisticsSnapshot.data() : null;
      if (!statistics) {
        statistics = await createStatistics(leagueId);
      }

      const playersRawData = (statistics?.playersRawData as { [key: string]: ITournamentPlayer[] }) || {};
      playersWithNames = Object.values(playersRawData).flat();
      matches = matchesSnapshot.docs.map((doc) => doc.data() as IMatch);

      logger.info("Otras ligas - Usando statistics", {
        numberOfPlayers: playersWithNames.length,
      });
    }

    // 3. --- Crear mapa scoreId -> match ---
    const scoreIdToMatch = new Map<string, IMatch>();
    matches.forEach((match) => {
      match.scoresId?.forEach((scoreId) => {
        if (scoreId) {
          scoreIdToMatch.set(scoreId, match);
        }
      });
    });

    // 2. --- Definir stages y obtener jugadores del documento de estadísticas ---
    const stages: Stage[] = [];
    
    // Manejar tanto roundDates como stagesDates
    // Para teamplay, priorizar stagesDates; para otras ligas, priorizar roundDates
    const roundsOrStages = isTeamplay 
      ? (tournament.stagesDates || tournament.roundDates)
      : (tournament.roundDates || tournament.stagesDates);
    
    if (roundsOrStages) {
      // Si es roundDates (array de strings), convertirlo a formato de rangos
      if (Array.isArray(roundsOrStages) && roundsOrStages.length > 0) {
        if (typeof roundsOrStages[0] === "string") {
          // Es roundDates (array de strings)
          (roundsOrStages as string[]).forEach((date, index) => {
            stages.push({
              id: `stage${index + 1}`,
              name: `Stage ${index + 1}`,
              start: normalizeDateToMMDDYYYY(date),
              end: normalizeDateToMMDDYYYY(date),
            });
          });
        } else {
          // Es stagesDates (array de objetos con start/end)
          (roundsOrStages as { start: string; end: string }[]).forEach((stage, index) => {
            stages.push({
              id: `stage${index + 1}`,
              name: `Stage ${index + 1}`,
              start: normalizeDateToMMDDYYYY(stage.start),
              end: normalizeDateToMMDDYYYY(stage.end),
            });
          });
        }
      }
    }

    const champStage = tournament.championshipDate
      ? {
          id: "champ",
          name: "Championship",
          start: normalizeDateToMMDDYYYY(tournament.championshipDate),
          end: normalizeDateToMMDDYYYY(tournament.championshipDate),
        }
      : null;

    // Log para depuración
    logger.info("Player Board Debug", {
      tournamentType: tournament.tournamentType,
      isDerby,
      isTeamplay,
      numberOfStages: stages.length,
      stages: stages.map(s => ({ id: s.id, start: s.start, end: s.end })),
      hasChampionship: !!champStage,
      numberOfPlayers: playersWithNames.length,
    });

    // 3. --- Pre-calcular todos los datos para cada jugador ---
    const allPlayersCalculatedData: PlayerCalculatedData[] = playersWithNames.map((player, playerIndex) => {
      if (isDerby) {
        // ===== LÓGICA PARA DERBY =====
        const stagePerformances: { [key: string]: { 
          bestNet: number; 
          netScores: string; 
          handicap: number; 
          course: string;
        } } = {};
        const stageScoresArray: number[] = [];

        // Log del primer jugador para ver formato de datos
        if (playerIndex === 0) {
          logger.info("Primer jugador - Debug de datos", {
            playerName: player.name,
            netCount: player.net?.length || 0,
            datesCount: player.date?.length || 0,
            sampleDates: player.date?.slice(0, 3) || [],
            sampleNets: player.net?.slice(0, 3) || [],
          });
        }

        stages.forEach((stage) => {
          const allScoresWithDates = (player.net || [])
            .map((net, i) => {
              const rawDate = player.date?.[i] || "";
              let normalizedDate = "";
              
              // Normalizar la fecha del jugador para que sea comparable
              if (rawDate) {
                try {
                  normalizedDate = normalizeDateToMMDDYYYY(rawDate);
                } catch (error) {
                  logger.warn(`Error normalizando fecha para jugador ${player.name}`, { 
                    rawDate, 
                    error: (error as Error).message 
                  });
                  normalizedDate = rawDate; // Usar la fecha raw si falla
                }
              }
              
              return { 
                net, 
                date: normalizedDate,
                handicap: player.handicap?.[i] || 0,
                scoreId: player.scoreId?.[i] || "",
                index: i
              };
            });

          // Log para el primer jugador y primer stage
          if (playerIndex === 0 && stage.id === "stage1") {
            logger.info("Stage 1 - Comparación de fechas", {
              stageStart: stage.start,
              stageEnd: stage.end,
              allScores: allScoresWithDates.map(s => ({ date: s.date, net: s.net })),
            });
          }

          const netScoresInStage = allScoresWithDates
            .filter((score) => score.date >= stage.start && score.date <= stage.end);

          // Log para el primer jugador
          if (playerIndex === 0) {
            logger.info(`${stage.id} - Scores encontrados`, {
              playerName: player.name,
              scoresFound: netScoresInStage.length,
              netScores: netScoresInStage.map(s => s.net),
            });
          }

          if (netScoresInStage.length > 0) {
            // Encontrar el mejor net (menor score)
            const bestScoreData = netScoresInStage.reduce((best, current) => 
              current.net < best.net ? current : best
            );
            
            const bestNet = bestScoreData.net;
            const netScores = netScoresInStage.map(s => s.net).join(" | ");
            const handicap = bestScoreData.handicap;
            const match = scoreIdToMatch.get(bestScoreData.scoreId);
            const course = match?.courseDisplayName || match?.course || "-";
            
            stagePerformances[stage.id] = { bestNet, netScores, handicap, course };
            stageScoresArray.push(bestNet);
          } else {
            stagePerformances[stage.id] = { bestNet: 0, netScores: "-", handicap: 0, course: "-" };
            stageScoresArray.push(0);
          }
        });

        let champScore = 0;
        let champW = 0;
        let champHandicap = 0;
        let champCourse = "-";
        
        if (champStage) {
          const champScoresData = (player.net || [])
            .map((net, i) => {
              const rawDate = player.date?.[i] || "";
              let normalizedDate = "";
              
              if (rawDate) {
                try {
                  normalizedDate = normalizeDateToMMDDYYYY(rawDate);
                } catch (error) {
                  normalizedDate = rawDate;
                }
              }
              
              return { 
                net, 
                date: normalizedDate,
                handicap: player.handicap?.[i] || 0,
                scoreId: player.scoreId?.[i] || "",
              };
            })
            .filter((score) => score.date >= champStage.start && score.date <= champStage.end);
          
          if (champScoresData.length > 0) {
            const bestChampData = champScoresData.reduce((best, current) => 
              current.net < best.net ? current : best
            );
            champScore = bestChampData.net;
            champHandicap = bestChampData.handicap;
            const match = scoreIdToMatch.get(bestChampData.scoreId);
            champCourse = match?.courseDisplayName || match?.course || "-";
            
            const weightedFactor = tournament.weightedChampionshipRound || 1;
            champW = champScore > 0 ? Math.round(champScore * weightedFactor) : 0;
          }
        }

        const stagesSum = stageScoresArray.reduce((acc, curr) => acc + curr, 0);
        const total = champW + stagesSum;

        return {
          name: player.name,
          team: player.team,
          stagePerformances,
          stageScoresArray,
          champScore,
          champW,
          champHandicap,
          champCourse,
          total,
          // Mantener valores legacy para compatibilidad
          topStage: 0,
          champ: champScore,
        };
      } else {
        // ===== LÓGICA PARA OTROS TIPOS DE LIGA (ORIGINAL) =====
        const stagePerformances: { [key: string]: { top: number; pointsPerStage: string } } = {};
        let topStage = 0;

        stages.forEach((stage) => {
          const stageScores = (player.pointsTeam || [])
            .map((p, i) => ({ point: p, date: player.date?.[i] || "" }))
            .filter((score) => score.date >= stage.start && score.date <= stage.end)
            .map((score) => score.point);

          if (stageScores.length > 0) {
            const top = Math.max(...stageScores);
            stagePerformances[stage.id] = { top, pointsPerStage: stageScores.join(" | ") };
            if (top > topStage) {topStage = top;}
          } else {
            stagePerformances[stage.id] = { top: 0, pointsPerStage: "-" };
          }
        });

        let champ = 0;
        if (champStage) {
          const champScores = (player.pointsTeam || [])
            .map((p, i) => ({ point: p, date: player.date?.[i] || "" }))
            .filter((score) => score.date >= champStage.start && score.date <= champStage.end)
            .map((score) => score.point);
          if (champScores.length > 0) {champ = Math.max(...champScores);}
        }

        return {
          name: player.name,
          team: player.team,
          stagePerformances,
          topStage,
          champ,
          total: topStage + champ,
        };
      }
    });

    // 4. --- Construir el objeto de respuesta final con datos ordenados ---
    const stagesData: { [key: string]: StageInfo } = {};

    if (isDerby) {
      // ===== RESPUESTA PARA DERBY =====
      stages.forEach((stage) => {
        const allPlayers: StagePlayerData[] = allPlayersCalculatedData
          .map((playerData) => {
            const stagePerf = playerData.stagePerformances[stage.id];
            if (!stagePerf) {
              logger.warn(`Stage ${stage.id} no encontrado en jugador ${playerData.name}`);
            }
            return {
              name: playerData.name,
              team: playerData.team,
              bestNet: stagePerf?.bestNet || 0,
              netScores: stagePerf?.netScores || "-",
              handicap: stagePerf?.handicap || 0,
              course: stagePerf?.course || "-",
              // Mantener para compatibilidad
              top: stagePerf?.bestNet || 0,
              pointsPerStage: stagePerf?.netScores || "-",
            };
          });
        
        // Filtrar y ordenar solo los jugadores con scores
        const playersWithScores = allPlayers
          .filter((p) => p.bestNet && p.bestNet > 0)
          .sort((a, b) => (a.bestNet || 0) - (b.bestNet || 0)); // Ordenar ascendente (menor net = mejor)

        // SIEMPRE retornar el stage, incluso si no hay jugadores con scores
        stagesData[stage.id] = {
          id: stage.id,
          name: stage.name,
          start: stage.start,
          end: stage.end,
          data: { players: playersWithScores },
        };
        
        logger.info(`Stage ${stage.id} procesado`, { 
          totalPlayers: allPlayers.length, 
          playersWithScores: playersWithScores.length 
        });
      });

      if (champStage) {
        const allChampPlayers = allPlayersCalculatedData
          .map((playerData) => ({
            name: playerData.name,
            team: playerData.team,
            total: playerData.total,
            stageScores: playerData.stageScoresArray,
            champScore: playerData.champScore,
            champW: playerData.champW,
            handicap: playerData.champHandicap,
            course: playerData.champCourse,
            // Mantener para compatibilidad
            topStage: playerData.topStage,
            champ: playerData.champ,
          }));
        
        // Ordenar Championship: Priorizar jugadores que SÍ jugaron Championship
        const playersForChamp = allChampPlayers
          .filter((p) => p.total > 0) // Solo jugadores con score
          .sort((a, b) => {
            // Prioridad 1: Jugadores CON champScore > 0 van ARRIBA
            const aHasChamp = (a.champScore ?? 0) > 0;
            const bHasChamp = (b.champScore ?? 0) > 0;
            
            if (aHasChamp && !bHasChamp) {
              return -1;  // a jugó Championship, va arriba
            }
            if (!aHasChamp && bHasChamp) {
              return 1;   // b jugó Championship, va arriba
            }
            
            // Prioridad 2: Si ambos tienen o ambos no tienen champScore, ordenar por total
            if (a.total === 0 && b.total === 0) {
              return 0;
            }
            if (a.total === 0) {
              return 1;   // a sin total, va al final
            }
            if (b.total === 0) {
              return -1;  // b sin total, va al final
            }
            
            // Ordenar por total ascendente (menor = mejor)
            return a.total - b.total;
          });

        stagesData["championship"] = {
          id: champStage.id,
          name: champStage.name,
          start: champStage.start,
          end: champStage.end,
          data: { players: playersForChamp },
        };
        
        logger.info("Championship procesado", { 
          totalPlayers: allChampPlayers.length, 
          playersWithScores: playersForChamp.length 
        });
      }
    } else {
      // ===== RESPUESTA PARA OTROS TIPOS DE LIGA (ORIGINAL) =====
      stages.forEach((stage) => {
        const playersForStage: StagePlayerData[] = allPlayersCalculatedData
          .map((playerData) => ({
            name: playerData.name,
            team: playerData.team,
            top: playerData.stagePerformances[stage.id]?.top || 0,
            pointsPerStage: playerData.stagePerformances[stage.id]?.pointsPerStage || "-",
          }))
          .sort((a, b) => (b.top || 0) - (a.top || 0)); // Ordenar descendente (mayor puntos = mejor)

        stagesData[stage.id] = {
          id: stage.id,
          name: stage.name,
          start: stage.start,
          end: stage.end,
          data: { players: playersForStage },
        };
      });

      if (champStage) {
        const playersForChamp: ChampionshipPlayerData[] = allPlayersCalculatedData
          .map((playerData) => ({
            name: playerData.name,
            team: playerData.team,
            total: playerData.total,
            topStage: playerData.topStage,
            champ: playerData.champ,
          }))
          .sort((a, b) => b.total - a.total); // Ordenar descendente (mayor puntos = mejor)

        stagesData["championship"] = {
          id: champStage.id,
          name: champStage.name,
          start: champStage.start,
          end: champStage.end,
          data: { players: playersForChamp },
        };
      }
    }

    return res.status(200).json({
      status: "success",
      data: {
        stages: stagesData,
      },
    });
  } catch (error) {
    logger.error("Error fetching player board", { error });
    return res.status(500).json({ error: "We found an error fetching your request!" });
  }
};


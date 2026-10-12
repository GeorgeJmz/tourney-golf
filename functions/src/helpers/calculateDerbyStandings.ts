import * as dayjs from "dayjs";
import * as isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { convertDate, getFormattedDate } from "./getFormattedDate";

dayjs.extend(isSameOrAfter);
import type { ITournament } from "../types/DashboardLeagues";
import type { ITournamentPlayer } from "../types/Standings";
import admin = require("firebase-admin");

interface DerbyStandingPlayer {
  tourneyName: string;
  bestNet: number;
}

export const calculateDerbyStandings = async (
  leagueId: string
): Promise<DerbyStandingPlayer[]> => {
  const db = admin.firestore();

  // Obtener fecha actual
  const { formattedDate } = getFormattedDate();
  const currentDate = formattedDate;

  // Obtener tournament y players en paralelo
  const [tournamentSnapshot, playersSnapshot] = await Promise.all([
    db.collection("tournament").where("id", "==", leagueId).limit(1).get(),
    db.collection("player").where("tournamentId", "==", leagueId).get(),
  ]);

  if (tournamentSnapshot.empty) {
    return [];
  }

  const tournament = tournamentSnapshot.docs[0].data() as ITournament & {
    roundDates?: { start: string; end: string }[];
    championshipDate?: string;
  };

  // Determinar el rango de fechas del round actual
  let dateRange = { start: "", end: "" };

  // Derby usa roundDates en lugar de stagesDates
  const roundDates = tournament.roundDates as { start: string; end: string }[] | undefined;

  if (roundDates) {
    for (const round of roundDates) {
      const startDate = convertDate(round.start, "MM/DD/YYYY");
      const endDate = convertDate(round.end, "MM/DD/YYYY");

      if (currentDate >= startDate && currentDate <= endDate) {
        dateRange = { start: startDate, end: endDate };
        break;
      }
    }
  }

  // Verificar si es Championship o si ya pasó: mostrar resultados del championship
  if (tournament.championshipDate) {
    const champDateStr = convertDate(tournament.championshipDate, "MM/DD/YYYY");
    const isChampionshipDayOrAfter = dayjs(currentDate, "MM/DD/YYYY").isSameOrAfter(
      dayjs(champDateStr, "MM/DD/YYYY"),
      "day"
    );
    if (isChampionshipDayOrAfter) {
      dateRange = { start: champDateStr, end: champDateStr };
    }
  }

  // Si no hay rango de fechas válido, no hay round activo
  if (!dateRange.start || !dateRange.end) {
    return [];
  }

  // Obtener todos los jugadores
  const allPlayers = playersSnapshot.docs.map((doc) => ({
    ...(doc.data() as ITournamentPlayer),
    id: doc.id,
  }));

  // Calcular el mejor net de cada jugador en el round actual
  const playersWithBestNet: DerbyStandingPlayer[] = allPlayers.map((player) => {
    const scoresInRange: number[] = [];

    player.net.forEach((net, index) => {
      const matchDate = player.date?.[index] ?? "";
      if (matchDate >= dateRange.start && matchDate <= dateRange.end) {
        scoresInRange.push(net);
      }
    });

    // Mejor net = menor score (mejor en golf)
    const bestNet = scoresInRange.length > 0 ? Math.min(...scoresInRange) : 0;

    return {
      tourneyName: player.name,
      bestNet,
    };
  });

  // Filtrar jugadores sin scores y ordenar por mejor net (ascendente)
  const sortedPlayers = playersWithBestNet
    .filter((p) => p.bestNet > 0)
    .sort((a, b) => a.bestNet - b.bestNet);

  return sortedPlayers;
};


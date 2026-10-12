import { Response } from "express";
import admin = require("firebase-admin");
import { ITournament } from "../types/DashboardLeagues";

type RequestGetPlayoffs = {
  body: {
    leagueId: string;
  };
};

type MatchView = { id: string; player1: string; player2: string };
type RoundView = { title: string; matches: MatchView[] };

const TITLE_MAP: Record<string, string> = {
  C: "ROUND C",
  B: "ROUND B",
  A: "ROUND A",
  Q: "QUARTERFINALS",
  S: "SEMIFINALS",
  F: "FINAL",
};

const toTitle = (name: string, prefix: string): string => {
  if (TITLE_MAP[prefix]) return TITLE_MAP[prefix];
  return name.toUpperCase();
};

const generateRounds = (
  numPlayers: number
): Array<{
  name: string;
  prefix: string;
  previousRound: string;
  matches: { id: string; name: string; player1Id: string; player2Id: string }[];
}> => {
  const rounds: Array<{
    name: string;
    prefix: string;
    previousRound: string;
    matches: { id: string; name: string; player1Id: string; player2Id: string }[];
  }> = [];
  let currentPlayers = numPlayers;
  let roundNumber = 1;

  while (currentPlayers > 1) {
    let roundName = "";
    let roundPrefix = "";
    let previousRound = "";

    if (currentPlayers === 2) {
      roundName = "Finals";
      roundPrefix = "F";
      previousRound = "S";
    } else if (currentPlayers === 4) {
      roundName = "Semifinals";
      roundPrefix = "S";
      previousRound = "Q";
    } else if (currentPlayers === 8) {
      roundName = "Quarterfinals";
      roundPrefix = "Q";
      previousRound = "A";
    } else if (currentPlayers === 16) {
      roundName = "Round A";
      roundPrefix = "A";
      previousRound = "B";
    } else if (currentPlayers === 32) {
      roundName = "Round B";
      roundPrefix = "B";
      previousRound = "C";
    } else if (currentPlayers === 64) {
      roundName = "Round C";
      roundPrefix = "C";
      previousRound = "";
    } else {
      roundName = `Round ${roundNumber}`;
      roundPrefix = `R${roundNumber}`;
    }

    if (numPlayers === currentPlayers) {
      previousRound = "";
    }

    const matchesInRound = [] as {
      id: string;
      name: string;
      player1Id: string;
      player2Id: string;
    }[];
    const numMatches = Math.ceil(currentPlayers / 2);

    for (let i = 0; i < numMatches; i++) {
      matchesInRound.push({
        id: `${roundPrefix}${i + 1}`,
        name: `${roundPrefix}${i + 1}`,
        player1Id: `${roundPrefix}${i + 1}_player1`,
        player2Id: `${roundPrefix}${i + 1}_player2`,
      });
    }

    rounds.push({
      name: roundName,
      prefix: roundPrefix,
      previousRound,
      matches: matchesInRound,
    });

    currentPlayers = Math.ceil(currentPlayers / 2);
    roundNumber++;
  }

  return rounds;
};

export const getPlayoffs = async (req: RequestGetPlayoffs, res: Response) => {
  const db = admin.firestore();
  const { leagueId } = req.body;

  if (!leagueId || typeof leagueId !== "string") {
    return res.status(400).json({ error: "Invalid leagueId" });
  }

  try {
    const snapshot = await db
      .collection("tournament")
      .where("id", "==", leagueId)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "Tournament not found" });
    }

    const tournament = snapshot.docs[0].data() as ITournament;

    const leagueName = tournament.name || "";
    const playersList = (tournament.playersList || []).map((p) => ({
      id: p.id || "",
      name: p.name || "",
    }));
    const playoffsDetail = tournament.playOffsDetail || {
      players: 0,
      brackets: {},
      matches: {},
    };

    const numberOfPlayers = playoffsDetail.players || 0;
    const selectedPlayers = playoffsDetail.brackets || {};

    if (!numberOfPlayers || numberOfPlayers < 2) {
      return res.status(200).json({
        status: "success",
        data: {
          league_id: leagueId,
          league_name: leagueName,
          rounds: [],
        },
      });
    }

    const rounds = generateRounds(numberOfPlayers);

    const resolvePlayerName = (slotId: string): string => {
      const value = selectedPlayers[slotId];
      if (value === "Bye") return "Bye";
      const player = playersList.find((p) => p.id === value);
      return player?.name || "";
    };

    const mapMatch = (
      roundPrefix: string,
      indexInRound: number,
      m: { id: string; player1Id: string; player2Id: string },
      previousRoundPrefix: string
    ): MatchView => {
      const p1 = resolvePlayerName(m.player1Id);
      const p2 = resolvePlayerName(m.player2Id);

      const fallbackP1 = previousRoundPrefix
        ? `Winner ${previousRoundPrefix}${indexInRound * 2 + 1}`
        : `Player ${indexInRound * 2 + 1}`;
      const fallbackP2 = previousRoundPrefix
        ? `Winner ${previousRoundPrefix}${indexInRound * 2 + 2}`
        : `Player ${indexInRound * 2 + 2}`;

      return {
        id: m.id,
        player1: p1 || fallbackP1,
        player2: p2 || fallbackP2,
      };
    };

    // Armar estructura solicitada
    const responseRounds: RoundView[] = [];
    let quarterfinals: RoundView | undefined;
    let semifinals: RoundView | undefined;
    let finalRound: RoundView | undefined;

    for (const r of rounds) {
      const title = toTitle(r.name, r.prefix);
      const matches = r.matches.map((m, idx) =>
        mapMatch(r.prefix, idx, m, r.previousRound)
      );

      if (r.prefix === "Q") {
        quarterfinals = { title, matches };
      } else if (r.prefix === "S") {
        semifinals = { title, matches };
      } else if (r.prefix === "F") {
        finalRound = { title, matches: matches.map((mm) => ({ ...mm, id: "VS" })) };
      } else if (["A", "B", "C"].includes(r.prefix)) {
        responseRounds.push({ title, matches });
      } else {
        // Rondas genéricas: incluir en rounds
        responseRounds.push({ title, matches });
      }
    }

    // Ordenar rounds por jerarquía C, B, A
    const order = { C: 0, B: 1, A: 2 } as Record<string, number>;
    responseRounds.sort((x, y) => {
      const xp = Object.entries(TITLE_MAP).find(([, v]) => v === x.title)?.[0] || "Z";
      const yp = Object.entries(TITLE_MAP).find(([, v]) => v === y.title)?.[0] || "Z";
      return (order[xp] ?? 99) - (order[yp] ?? 99);
    });

    return res.status(200).json({
      status: "success",
      data: {
        league_id: leagueId,
        league_name: leagueName,
        rounds: responseRounds,
        ...(quarterfinals ? { quarterfinals } : {}),
        ...(semifinals ? { semifinals } : {}),
        ...(finalRound ? { final: finalRound } : {}),
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Error fetching playoffs" });
  }
};



/**
 * Script para analizar los datos de un tournament en el emulador de Firestore.
 * Ejecutar con: FIRESTORE_EMULATOR_HOST='127.0.0.1:8081' npx ts-node src/scripts/analyzeTournamentEmulator.ts
 *
 * Uso: npx ts-node src/scripts/analyzeTournamentEmulator.ts [tournamentId]
 */

import * as admin from "firebase-admin";
import * as path from "path";
import { config } from "dotenv";

// Conectar al emulador
process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8081";

// Cargar .env
const envPath = path.resolve(__dirname, "../../../.env");
config({ path: envPath });

const projectId = process.env.REACT_APP_PROJECTID || "demo-project";
const privateKey = process.env.REACT_APP_PRIVATEKEY?.replace(/\\n/g, "\n");
const clientEmail = process.env.REACT_APP_CLIENTEMAIL;

if (!projectId) {
  console.error("REACT_APP_PROJECTID no definido. Usa .env o variables de entorno.");
  process.exit(1);
}

if (privateKey && clientEmail) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
} else {
  admin.initializeApp({ projectId });
}

const db = admin.firestore();

const TOURNAMENT_ID = process.argv[2] || "cwfZCZMZV8GARU9R9TUM";

async function analyzeTournament() {
  console.log("\n========================================");
  console.log("ANÁLISIS DE TOURNAMENT EN EMULADOR");
  console.log("========================================");
  console.log(`Tournament ID buscado: ${TOURNAMENT_ID}\n`);

  try {
    // 1. Buscar tournament por id (campo)
    let tournamentSnapshot = await db
      .collection("tournament")
      .where("id", "==", TOURNAMENT_ID)
      .get();

    // 2. Si no existe, intentar por document ID
    if (tournamentSnapshot.empty) {
      const docRef = db.collection("tournament").doc(TOURNAMENT_ID);
      const doc = await docRef.get();
      if (doc.exists) {
        tournamentSnapshot = { empty: false, docs: [doc] } as admin.firestore.QuerySnapshot;
      }
    }

    if (tournamentSnapshot.empty) {
      console.error("❌ Tournament no encontrado con id:", TOURNAMENT_ID);
      console.log("\nTournaments disponibles en el emulador:");
      const allTournaments = await db.collection("tournament").get();
      allTournaments.docs.forEach((d) => {
        const data = d.data();
        console.log(`  - Doc ID: ${d.id} | id: ${data.id || "N/A"} | name: ${data.name || "N/A"}`);
      });
      return;
    }

    const tournamentDoc = tournamentSnapshot.docs[0];
    const tournamentData = tournamentDoc.data();
    const tournamentDocId = tournamentDoc.id;
    const effectiveId = tournamentData.id || tournamentDocId;

    console.log("✅ TOURNAMENT ENCONTRADO");
    console.log("----------------------------------------");
    console.log("Document ID (Firestore):", tournamentDocId);
    console.log("Campo id:", tournamentData.id);
    console.log("Nombre:", tournamentData.name);
    console.log("Tipo:", tournamentData.tournamentType);
    console.log("Play Type:", tournamentData.playType);
    console.log("Status:", tournamentData.status);
    console.log("Jugadores configurados:", tournamentData.playersList?.length || 0);
    console.log("Start Date:", tournamentData.startDate);
    console.log("Cut Off Date:", tournamentData.cutOffDate);
    console.log("PlayOffs:", tournamentData.playOffs);
    console.log("Champion:", tournamentData.champion || "N/A");
    console.log("");

    // 3. Players
    const playersSnapshot = await db
      .collection("player")
      .where("tournamentId", "==", effectiveId)
      .get();

    console.log("----------------------------------------");
    console.log("PLAYERS (Jugadores en el torneo)");
    console.log("----------------------------------------");
    console.log("Total:", playersSnapshot.size);

    const players: { docId: string; email: string; scoreIdCount: number }[] = [];
    playersSnapshot.docs.forEach((doc) => {
      const d = doc.data();
      players.push({
        docId: doc.id,
        email: d.email,
        scoreIdCount: d.scoreId?.length || 0,
      });
    });

    players.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.email} (doc: ${p.docId}) - ${p.scoreIdCount} scores`);
    });
    console.log("");

    // 4. Matches
    const matchesSnapshot = await db
      .collection("match")
      .where("tournamentId", "==", effectiveId)
      .get();

    console.log("----------------------------------------");
    console.log("MATCHES (Partidos)");
    console.log("----------------------------------------");
    console.log("Total:", matchesSnapshot.size);

    const allScoreIds = new Set<string>();
    const matchesByDate: { id: string; date: string; players: number; scoresId: string[] }[] = [];

    matchesSnapshot.docs.forEach((doc) => {
      const d = doc.data();
      const scoresId = d.scoresId || [];
      scoresId.forEach((sid: string) => allScoreIds.add(sid));
      matchesByDate.push({
        id: doc.id,
        date: Array.isArray(d.date) ? d.date[0] : d.date || "N/A",
        players: d.matchResults?.length || 0,
        scoresId,
      });
    });

    matchesByDate
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .forEach((m, i) => {
        console.log(`  ${i + 1}. Match ${m.id} | ${m.date} | ${m.players} jugadores | ${m.scoresId.length} scores`);
      });
    console.log("");

    // 5. Scores
    console.log("----------------------------------------");
    console.log("SCORES (Scorecards)");
    console.log("----------------------------------------");
    console.log("IDs únicos referenciados en matches:", allScoreIds.size);

    let scoresFound = 0;
    let scoresMissing = 0;
    for (const scoreId of allScoreIds) {
      const scoreDoc = await db.collection("score").doc(scoreId).get();
      if (scoreDoc.exists) scoresFound++;
      else scoresMissing++;
    }
    console.log("  Encontrados en colección score:", scoresFound);
    console.log("  Faltantes (referencias rotas):", scoresMissing);
    console.log("");

    // 6. Statistics
    const statsDoc = await db.collection("statistics").doc(effectiveId).get();
    console.log("----------------------------------------");
    console.log("STATISTICS");
    console.log("----------------------------------------");
    if (statsDoc.exists) {
      const statsData = statsDoc.data() ?? {};
      const playersCount = Array.isArray(statsData.players)
        ? statsData.players.length
        : statsData.players
        ? Object.keys(statsData.players).length
        : 0;
      console.log("  Documento existe:", true);
      console.log("  Players en stats:", playersCount);
      console.log("  Results (matches) en stats:", (statsData.results as unknown[])?.length || 0);
    } else {
      console.log("  Documento NO existe (se genera por onUpdatePlayer)");
    }
    console.log("");

    // 7. Usuarios referenciados
    const playerEmails = new Set(players.map((p) => p.email));
    console.log("----------------------------------------");
    console.log("USUARIOS (Verificación en colección users)");
    console.log("----------------------------------------");
    console.log("Emails únicos en players:", playerEmails.size);

    let usersFound = 0;
    const chunk = Array.from(playerEmails);
    for (let i = 0; i < chunk.length; i += 30) {
      const batch = chunk.slice(i, i + 30);
      const usersSnap = await db.collection("users").where("email", "in", batch).get();
      usersFound += usersSnap.size;
    }
    console.log("  Usuarios encontrados en colección users:", usersFound);
    if (usersFound < playerEmails.size) {
      console.log("  ⚠️  Algunos jugadores NO tienen documento en users");
    }
    console.log("");

    // Resumen para migración
    console.log("========================================");
    console.log("RESUMEN PARA MIGRACIÓN");
    console.log("========================================");
    console.log(`
  Colección        | Cantidad
  -----------------|---------
  tournament       | 1 (doc: ${tournamentDocId})
  player           | ${playersSnapshot.size}
  match            | ${matchesSnapshot.size}
  score            | ${allScoreIds.size} únicos
  statistics       | ${statsDoc.exists ? "1" : "0"}
  users (referencia)| ${usersFound}/${playerEmails.size}

  Tipo de liga: ${tournamentData.tournamentType}
  Estado: ${tournamentData.status}
  Tiene playoffs: ${tournamentData.playOffs}
  Scores faltantes: ${scoresMissing}
    `.trim());
    console.log("");
  } catch (error) {
    console.error("Error durante el análisis:", error);
    throw error;
  }
}

analyzeTournament()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));

/**
 * Script para migrar un tournament completo del emulador a producción
 * 
 * PRECONDICIONES:
 * 1. Backup de producción creado y verificado
 * 2. Emulador corriendo con los datos a migrar
 * 3. Credenciales de producción en .env
 * 
 * Ejecutar con: npm run migrate-tournament -- [tournamentId]
 */

import * as admin from "firebase-admin";
import * as path from "path";
import * as fs from "fs";
import { config } from "dotenv";

// Cargar .env
const envPath = path.resolve(__dirname, "../../../.env");
config({ path: envPath });

const projectId = process.env.REACT_APP_PROJECTID;
const privateKey = process.env.REACT_APP_PRIVATEKEY?.replace(/\\n/g, "\n");
const clientEmail = process.env.REACT_APP_CLIENTEMAIL;

if (!projectId || !privateKey || !clientEmail) {
  console.error("❌ Faltan credenciales en .env");
  process.exit(1);
}

const TOURNAMENT_ID = process.argv[2] || "cwfZCZMZV8GARU9R9TUM";

// Inicializar dos apps: una para emulador, otra para producción
const emulatorApp = admin.initializeApp(
  {
    projectId: "demo-emulator",
  },
  "emulator"
);

const prodApp = admin.initializeApp(
  {
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  },
  "production"
);

// Configurar emulador para la app de emulador
const emulatorDb = emulatorApp.firestore();
emulatorDb.settings({
  host: "127.0.0.1:8081",
  ssl: false,
});

const prodDb = prodApp.firestore();

// Logs para archivo
const logDir = path.resolve(__dirname, "../../../migration-logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}
const logFile = path.join(logDir, `migration-${new Date().toISOString().replace(/[:.]/g, "-")}.log`);
const logStream = fs.createWriteStream(logFile, { flags: "a" });

function log(message: string) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  logStream.write(logMessage + "\n");
}

// Mapeos de IDs viejos -> nuevos
const scoreIdMapping = new Map<string, string>();
const matchIdMapping = new Map<string, string>();
const playerDocIdMapping = new Map<string, string>();

async function extractFromEmulator() {
  log("\n========================================");
  log("PASO 1: EXTRAYENDO DATOS DEL EMULADOR");
  log("========================================");

  try {
    // 1. Tournament
    log(`\n📦 Buscando tournament: ${TOURNAMENT_ID}`);
    let tournamentSnapshot = await emulatorDb
      .collection("tournament")
      .where("id", "==", TOURNAMENT_ID)
      .get();

    if (tournamentSnapshot.empty) {
      const doc = await emulatorDb.collection("tournament").doc(TOURNAMENT_ID).get();
      if (doc.exists) {
        tournamentSnapshot = { empty: false, docs: [doc] } as any;
      }
    }

    if (tournamentSnapshot.empty) {
      throw new Error(`Tournament ${TOURNAMENT_ID} no encontrado en emulador`);
    }

    const tournamentDoc = tournamentSnapshot.docs[0];
    const tournamentData = tournamentDoc.data();
    const effectiveId = tournamentData.id || tournamentDoc.id;

    log(`✅ Tournament encontrado: ${tournamentData.name}`);
    log(`   Tipo: ${tournamentData.tournamentType}`);
    log(`   Estado: ${tournamentData.status}`);

    // 2. Players
    log("\n📦 Extrayendo players...");
    const playersSnapshot = await emulatorDb
      .collection("player")
      .where("tournamentId", "==", effectiveId)
      .get();

    const players = playersSnapshot.docs.map((doc) => ({
      docId: doc.id,
      data: doc.data(),
    }));
    log(`✅ ${players.length} players extraídos`);

    // 3. Matches (ordenados por fecha)
    log("\n📦 Extrayendo matches...");
    const matchesSnapshot = await emulatorDb
      .collection("match")
      .where("tournamentId", "==", effectiveId)
      .get();

    const matches = matchesSnapshot.docs
      .map((doc) => ({
        docId: doc.id,
        data: doc.data(),
      }))
      .sort((a, b) => {
        const dateA = Array.isArray(a.data.date) ? a.data.date[0] : a.data.date;
        const dateB = Array.isArray(b.data.date) ? b.data.date[0] : b.data.date;
        return new Date(dateA).getTime() - new Date(dateB).getTime();
      });

    log(`✅ ${matches.length} matches extraídos`);

    // 4. Scores
    log("\n📦 Extrayendo scores...");
    const allScoreIds = new Set<string>();
    matches.forEach((match) => {
      const scoresId = match.data.scoresId || [];
      scoresId.forEach((sid: string) => allScoreIds.add(sid));
    });

    const scores: { docId: string; data: any }[] = [];
    for (const scoreId of allScoreIds) {
      const scoreDoc = await emulatorDb.collection("score").doc(scoreId).get();
      if (scoreDoc.exists) {
        scores.push({
          docId: scoreDoc.id,
          data: scoreDoc.data(),
        });
      }
    }
    log(`✅ ${scores.length} scores extraídos`);

    return {
      tournament: { docId: tournamentDoc.id, data: tournamentData, effectiveId },
      players,
      matches,
      scores,
    };
  } catch (error) {
    log(`❌ Error extrayendo datos del emulador: ${error}`);
    throw error;
  }
}

async function validateUsers(data: any) {
  log("\n========================================");
  log("PASO 2: VALIDANDO USUARIOS EN PRODUCCIÓN");
  log("========================================");

  const playerEmails = new Set<string>(data.players.map((p: any) => p.data.email as string));
  log(`\n📧 Validando ${playerEmails.size} emails...`);

  const emailsArray = Array.from(playerEmails);
  const usersFound: { email: string; id: string }[] = [];
  const usersMissing: string[] = [];

  // Consultar en batches de 30 (límite de Firestore para "in")
  for (let i = 0; i < emailsArray.length; i += 30) {
    const batch = emailsArray.slice(i, i + 30);
    const usersSnap = await prodDb.collection("users").where("email", "in", batch).get();

    usersSnap.docs.forEach((doc) => {
      const userData = doc.data();
      usersFound.push({ email: userData.email, id: doc.id });
    });
  }

  // Identificar faltantes
  emailsArray.forEach((email) => {
    if (!usersFound.find((u) => u.email === email)) {
      usersMissing.push(email);
    }
  });

  log(`✅ Usuarios encontrados: ${usersFound.length}/${playerEmails.size}`);

  if (usersMissing.length > 0) {
    log(`❌ Usuarios faltantes en producción:`);
    usersMissing.forEach((email) => log(`   - ${email}`));
    throw new Error(`Faltan ${usersMissing.length} usuarios en producción. Créalos antes de continuar.`);
  }

  return new Map(usersFound.map((u) => [u.email, u.id]));
}

async function checkTournamentExists(tournamentId: string) {
  log("\n📋 Verificando si el tournament ya existe en producción...");

  const existingSnap = await prodDb
    .collection("tournament")
    .where("id", "==", tournamentId)
    .get();

  if (!existingSnap.empty) {
    const existing = existingSnap.docs[0].data();
    log(`⚠️  ADVERTENCIA: Ya existe un tournament con id=${tournamentId}`);
    log(`   Nombre: ${existing.name}`);
    log(`   Status: ${existing.status}`);

    // Preguntar al usuario (simulado - en realidad detener)
    throw new Error(
      "El tournament ya existe en producción. Para evitar duplicados, el script se detiene. " +
        "Si quieres sobrescribirlo, primero elimínalo manualmente."
    );
  }

  log("✅ El tournament NO existe en producción, se puede crear");
}

async function migrateTournament(data: any, userMapping: Map<string, string>) {
  log("\n========================================");
  log("PASO 3: MIGRANDO TOURNAMENT");
  log("========================================");

  const { tournament } = data;
  const tournamentData = { ...tournament.data };

  // Actualizar playersList con IDs de producción si es necesario
  if (tournamentData.playersList) {
    tournamentData.playersList = tournamentData.playersList.map((player: any) => ({
      ...player,
      // Mantener email como identificador principal (teamplay usa email)
    }));
  }

  // IMPORTANTE: Crear con status "draft" temporalmente para evitar triggers
  const originalStatus = tournamentData.status;
  tournamentData.status = "draft";

  // Crear el documento
  const newTournamentRef = prodDb.collection("tournament").doc();
  const newTournamentId = newTournamentRef.id;

  // Actualizar el campo id con el nuevo ID
  tournamentData.id = newTournamentId;

  await newTournamentRef.set(tournamentData);

  log(`✅ Tournament creado en producción`);
  log(`   Doc ID: ${newTournamentRef.id}`);
  log(`   Campo id: ${tournamentData.id}`);
  log(`   Status temporal: draft (original: ${originalStatus})`);

  return { newTournamentId, originalStatus };
}

async function migratePlayers(data: any, newTournamentId: string) {
  log("\n========================================");
  log("PASO 4: MIGRANDO PLAYERS (VACÍOS)");
  log("========================================");

  log("ℹ️  Los players se crean con arrays vacíos.");
  log("   Se llenarán al migrar los matches.\n");

  for (const player of data.players) {
    const playerData = { ...player.data };

    // Actualizar tournamentId al nuevo ID
    playerData.tournamentId = newTournamentId;

    // VACIAR los arrays que se llenarán con los matches
    playerData.scoreId = [];
    playerData.opponent = [];
    playerData.pointsMatch = [];
    playerData.pointsStroke = [];
    playerData.pointsTeam = [];
    playerData.bonusPoints = [];
    playerData.gross = [];
    playerData.handicap = [];
    playerData.net = [];
    playerData.date = [];

    // Crear en producción
    const newPlayerRef = prodDb.collection("player").doc();
    await newPlayerRef.set(playerData);

    // Guardar mapeo: email -> docId en producción
    playerDocIdMapping.set(playerData.email, newPlayerRef.id);

    log(`   ✓ Player creado: ${playerData.email} (${newPlayerRef.id})`);
  }

  log(`\n✅ ${data.players.length} players migrados`);
}

async function migrateMatchesAndScores(data: any, newTournamentId: string) {
  log("\n========================================");
  log("PASO 5: MIGRANDO MATCHES Y SCORES");
  log("========================================");

  let matchCount = 0;

  for (const match of data.matches) {
    matchCount++;
    log(`\n[${matchCount}/${data.matches.length}] Migrando match ${match.docId}...`);

    const matchData = { ...match.data };
    const oldScoresId = matchData.scoresId || [];

    // 1. Crear los scores en producción
    const newScoresId: string[] = [];
    for (const oldScoreId of oldScoresId) {
      const scoreData = data.scores.find((s: any) => s.docId === oldScoreId);
      if (!scoreData) {
        log(`   ⚠️  Score ${oldScoreId} no encontrado, saltando`);
        continue;
      }

      const newScoreRef = prodDb.collection("score").doc();
      await newScoreRef.set(scoreData.data);

      newScoresId.push(newScoreRef.id);
      scoreIdMapping.set(oldScoreId, newScoreRef.id);
    }

    log(`   ✓ ${newScoresId.length} scores creados`);

    // 2. Actualizar los players con la info del match
    const matchResults = matchData.matchResults || [];
    for (let i = 0; i < matchResults.length; i++) {
      const result = matchResults[i];
      const playerEmail = result.idPlayer;
      const newScoreId = newScoresId[i];

      const playerDocId = playerDocIdMapping.get(playerEmail);
      if (!playerDocId) {
        log(`   ⚠️  Player ${playerEmail} no encontrado en mapeo`);
        continue;
      }

      // Obtener el score completo para extraer datos
      const scoreData = data.scores.find(
        (s: any) => s.docId === oldScoresId[i]
      )?.data;

      if (!scoreData) continue;

      // Obtener el documento actual del player
      const playerRef = prodDb.collection("player").doc(playerDocId);
      const playerSnap = await playerRef.get();
      const currentData = playerSnap.data();

      if (!currentData) continue;

      // Determinar el oponente (para teamplay es vacío "")
      const opponent = matchResults.length === 2 
        ? matchResults.find((r: any) => r.idPlayer !== playerEmail)?.idPlayer || ""
        : "";

      // Actualizar arrays
      await playerRef.update({
        scoreId: admin.firestore.FieldValue.arrayUnion(newScoreId),
        opponent: admin.firestore.FieldValue.arrayUnion(opponent),
        pointsMatch: [...(currentData.pointsMatch || []), result.matchPoints || 0],
        pointsStroke: [...(currentData.pointsStroke || []), result.medalPoints || 0],
        pointsTeam: [...(currentData.pointsTeam || []), result.teamPoints || 0],
        bonusPoints: [...(currentData.bonusPoints || []), result.bonusPoints || 0],
        gross: [...(currentData.gross || []), scoreData.totalGross],
        handicap: [...(currentData.handicap || []), scoreData.handicap],
        net: [...(currentData.net || []), scoreData.totalNet],
        date: [
          ...(currentData.date || []),
          Array.isArray(matchData.date) ? matchData.date[0] : matchData.date,
        ],
      });
    }

    log(`   ✓ ${matchResults.length} players actualizados`);

    // 3. Crear el match en producción
    matchData.tournamentId = newTournamentId;
    matchData.scoresId = newScoresId;
    delete matchData.id; // Dejar que Firestore genere el ID

    const newMatchRef = prodDb.collection("match").doc();
    matchData.id = newMatchRef.id;
    await newMatchRef.set(matchData);

    matchIdMapping.set(match.docId, newMatchRef.id);

    log(`   ✓ Match creado: ${newMatchRef.id}`);
  }

  log(`\n✅ ${matchCount} matches migrados con todos sus scores`);
}

async function regenerateStatistics(newTournamentId: string) {
  log("\n========================================");
  log("PASO 6: REGENERANDO STATISTICS");
  log("========================================");

  log("ℹ️  Llamando a createStatistics para generar el documento...");

  // Importar la función
  const { createStatistics } = await import("../helpers/createStatistics");

  try {
    await createStatistics(newTournamentId);
    log("✅ Statistics generado correctamente");
  } catch (error) {
    log(`⚠️  Error generando statistics: ${error}`);
    log("   Puedes regenerarlo manualmente después");
  }
}

async function updateUsersHistory(data: any, newTournamentId: string, originalStatus: string) {
  log("\n========================================");
  log("PASO 7: ACTUALIZANDO USUARIOS");
  log("========================================");

  const playerEmails = data.players.map((p: any) => p.data.email);
  const tournamentName = data.tournament.data.name;

  log(`\n📧 Actualizando ${playerEmails.length} usuarios...`);

  for (let i = 0; i < playerEmails.length; i += 30) {
    const batch = playerEmails.slice(i, i + 30);
    const usersSnap = await prodDb.collection("users").where("email", "in", batch).get();

    for (const userDoc of usersSnap.docs) {
      const userData = userDoc.data();

      if (originalStatus === "closed") {
        // Agregar a historyTournaments
        const historyTournaments = userData.historyTournaments || [];
        const alreadyExists = historyTournaments.some(
          (t: any) => t.tournamentId === newTournamentId
        );

        if (!alreadyExists) {
          await userDoc.ref.update({
            historyTournaments: admin.firestore.FieldValue.arrayUnion({
              tournamentId: newTournamentId,
              tournamentName: tournamentName,
              result: "", // Se puede actualizar después
            }),
          });
          log(`   ✓ ${userData.email} -> historyTournaments`);
        }
      } else {
        // Agregar a activeTournaments
        const activeTournaments = userData.activeTournaments || [];
        const alreadyExists = activeTournaments.some(
          (t: any) => t.tournamentId === newTournamentId
        );

        if (!alreadyExists) {
          await userDoc.ref.update({
            activeTournaments: admin.firestore.FieldValue.arrayUnion({
              tournamentId: newTournamentId,
              tournamentName: tournamentName,
            }),
          });
          log(`   ✓ ${userData.email} -> activeTournaments`);
        }
      }
    }
  }

  log("\n✅ Usuarios actualizados");
}

async function finalizeTournament(newTournamentId: string, originalStatus: string) {
  log("\n========================================");
  log("PASO 8: FINALIZANDO TOURNAMENT");
  log("========================================");

  log(`\nCambiando status a: ${originalStatus}`);

  await prodDb.collection("tournament").doc(newTournamentId).update({
    status: originalStatus,
  });

  log(`✅ Tournament finalizado con status: ${originalStatus}`);

  if (originalStatus === "closed") {
    log("ℹ️  El trigger onFinishLeague se ejecutará automáticamente");
  }
}

async function migrate() {
  const startTime = Date.now();

  try {
    log("\n╔════════════════════════════════════════╗");
    log("║   MIGRACIÓN DE TOURNAMENT A PRODUCCIÓN   ║");
    log("╚════════════════════════════════════════╝");
    log(`\nTournament ID: ${TOURNAMENT_ID}`);
    log(`Proyecto destino: ${projectId}`);

    // PASO 1: Extraer datos del emulador
    const data = await extractFromEmulator();

    // PASO 2: Validar usuarios
    const userMapping = await validateUsers(data);

    // PASO 3: Verificar que no exista
    await checkTournamentExists(data.tournament.effectiveId);

    // PASO 4: Migrar tournament
    const { newTournamentId, originalStatus } = await migrateTournament(data, userMapping);

    // PASO 5: Migrar players (vacíos)
    await migratePlayers(data, newTournamentId);

    // PASO 6: Migrar matches y scores
    await migrateMatchesAndScores(data, newTournamentId);

    // PASO 7: Regenerar statistics
    await regenerateStatistics(newTournamentId);

    // PASO 8: Actualizar usuarios
    await updateUsersHistory(data, newTournamentId, originalStatus);

    // PASO 9: Finalizar tournament
    await finalizeTournament(newTournamentId, originalStatus);

    // RESUMEN
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

    log("\n╔════════════════════════════════════════╗");
    log("║        MIGRACIÓN COMPLETADA ✅          ║");
    log("╚════════════════════════════════════════╝");
    log(`\nTiempo total: ${elapsed}s`);
    log(`\nNuevo Tournament ID: ${newTournamentId}`);
    log(`\nResumen:`);
    log(`  - Tournament: 1`);
    log(`  - Players: ${data.players.length}`);
    log(`  - Matches: ${data.matches.length}`);
    log(`  - Scores: ${data.scores.length}`);
    log(`\nLog guardado en: ${logFile}`);
    log("\n⚠️  IMPORTANTE:");
    log("   1. Verifica los datos en Firebase Console");
    log("   2. Prueba la aplicación con la liga migrada");
    log("   3. Si todo está bien, puedes eliminar el backup después de 30 días");

    logStream.end();
  } catch (error) {
    log(`\n❌ ERROR DURANTE LA MIGRACIÓN:`);
    log(String(error));
    log("\n⚠️  La migración falló. Los datos pueden estar incompletos.");
    log("   Revisa el log y considera restaurar desde el backup.");
    logStream.end();
    throw error;
  }
}

migrate()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));

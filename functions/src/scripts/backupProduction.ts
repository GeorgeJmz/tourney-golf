/**
 * Script para crear respaldo completo de producción de Firestore
 * Ejecutar con: npm run backup-prod
 * 
 * IMPORTANTE: Este script se conecta a PRODUCCIÓN, no al emulador.
 */

import * as admin from "firebase-admin";
import * as path from "path";
import * as fs from "fs";
import { config } from "dotenv";

// NO establecer FIRESTORE_EMULATOR_HOST - queremos conectar a producción
if (process.env.FIRESTORE_EMULATOR_HOST) {
  console.error("⚠️  FIRESTORE_EMULATOR_HOST está configurado. Este script debe conectarse a PRODUCCIÓN.");
  console.error("Elimina la variable o ejecuta sin ella.");
  process.exit(1);
}

// Cargar .env
const envPath = path.resolve(__dirname, "../../../.env");
config({ path: envPath });

const projectId = process.env.REACT_APP_PROJECTID;
const privateKey = process.env.REACT_APP_PRIVATEKEY?.replace(/\\n/g, "\n");
const clientEmail = process.env.REACT_APP_CLIENTEMAIL;

if (!projectId || !privateKey || !clientEmail) {
  console.error("❌ Faltan credenciales en .env:");
  console.error("   - REACT_APP_PROJECTID");
  console.error("   - REACT_APP_PRIVATEKEY");
  console.error("   - REACT_APP_CLIENTEMAIL");
  process.exit(1);
}

console.log(`🔗 Conectando a PRODUCCIÓN: ${projectId}`);

admin.initializeApp({
  credential: admin.credential.cert({
    projectId,
    clientEmail,
    privateKey,
  }),
});

const db = admin.firestore();

// Crear carpeta de backups
const backupDir = path.resolve(__dirname, "../../../backups");
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupFolder = path.join(backupDir, `backup-${timestamp}`);
fs.mkdirSync(backupFolder, { recursive: true });

async function backupCollection(collectionName: string, filter?: { field: string; value: string }) {
  console.log(`\n📦 Respaldando colección: ${collectionName}`);
  
  try {
    let query: admin.firestore.Query = db.collection(collectionName);
    
    if (filter) {
      query = query.where(filter.field, "==", filter.value);
      console.log(`   Filtro aplicado: ${filter.field} == ${filter.value}`);
    }
    
    const snapshot = await query.get();
    
    if (snapshot.empty) {
      console.log(`   ⚠️  Colección vacía o sin resultados`);
      return { collection: collectionName, count: 0, docs: [] };
    }
    
    const docs = snapshot.docs.map((doc) => ({
      docId: doc.id,
      data: doc.data(),
    }));
    
    const filename = filter 
      ? `${collectionName}-${filter.value}.json`
      : `${collectionName}.json`;
    
    const filepath = path.join(backupFolder, filename);
    fs.writeFileSync(filepath, JSON.stringify(docs, null, 2), "utf8");
    
    console.log(`   ✅ ${snapshot.size} documentos respaldados en: ${filename}`);
    
    return { collection: collectionName, count: snapshot.size, docs };
  } catch (error) {
    console.error(`   ❌ Error respaldando ${collectionName}:`, error);
    throw error;
  }
}

async function createBackup() {
  console.log("\n========================================");
  console.log("CREANDO RESPALDO DE PRODUCCIÓN");
  console.log("========================================");
  console.log(`Proyecto: ${projectId}`);
  console.log(`Carpeta: ${backupFolder}`);
  console.log("========================================\n");
  
  const startTime = Date.now();
  const summary: { collection: string; count: number }[] = [];
  
  try {
    // 1. Respaldar TODAS las colecciones principales
    console.log("📋 PASO 1: Colecciones principales");
    
    const result1 = await backupCollection("tournament");
    summary.push({ collection: "tournament", count: result1.count });
    
    const result2 = await backupCollection("player");
    summary.push({ collection: "player", count: result2.count });
    
    const result3 = await backupCollection("match");
    summary.push({ collection: "match", count: result3.count });
    
    const result4 = await backupCollection("score");
    summary.push({ collection: "score", count: result4.count });
    
    const result5 = await backupCollection("statistics");
    summary.push({ collection: "statistics", count: result5.count });
    
    const result6 = await backupCollection("users");
    summary.push({ collection: "users", count: result6.count });
    
    // 2. Crear manifiesto del backup
    const manifest = {
      timestamp: new Date().toISOString(),
      projectId,
      collections: summary,
      totalDocuments: summary.reduce((acc, curr) => acc + curr.count, 0),
    };
    
    const manifestPath = path.join(backupFolder, "manifest.json");
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
    
    // 3. Crear README
    const readme = `# Backup de Producción - ${timestamp}

## Información
- **Proyecto**: ${projectId}
- **Fecha**: ${new Date().toISOString()}
- **Documentos totales**: ${manifest.totalDocuments}

## Colecciones respaldadas

${summary.map((s) => `- **${s.collection}**: ${s.count} documentos`).join("\n")}

## Archivos generados
${summary.map((s) => `- ${s.collection}.json`).join("\n")}
- manifest.json (este archivo)
- README.md (instrucciones)

## Restauración
Para restaurar este backup, usa el script de restauración:
\`\`\`bash
npm run restore-backup -- ${path.basename(backupFolder)}
\`\`\`

## IMPORTANTE
⚠️  NO eliminar este backup hasta verificar que la migración fue exitosa.
⚠️  Mantener este backup por al menos 30 días.
`;
    
    const readmePath = path.join(backupFolder, "README.md");
    fs.writeFileSync(readmePath, readme, "utf8");
    
    // 4. Resumen final
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log("\n========================================");
    console.log("✅ RESPALDO COMPLETADO");
    console.log("========================================");
    console.log(`Tiempo: ${elapsed}s`);
    console.log(`Carpeta: ${backupFolder}`);
    console.log(`Total de documentos: ${manifest.totalDocuments}`);
    console.log("\nColecciones:");
    summary.forEach((s) => {
      console.log(`  - ${s.collection}: ${s.count} docs`);
    });
    console.log("\n⚠️  IMPORTANTE:");
    console.log("   - Verifica que los archivos se crearon correctamente");
    console.log("   - NO elimines este backup hasta completar la migración");
    console.log("   - Guarda el path del backup para referencia futura");
    console.log("\n========================================\n");
    
  } catch (error) {
    console.error("\n❌ ERROR durante el respaldo:", error);
    console.error("\nEl backup puede estar incompleto. Revisa los archivos creados.");
    throw error;
  }
}

createBackup()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));

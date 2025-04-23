// Guardar como: functions/src/scripts/assignSequentialIdsToExistingUsers.ts

import * as admin from "firebase-admin";
import { QueryDocumentSnapshot, WriteBatch } from "firebase-admin/firestore"; // Importar tipos específicos
import { config } from "dotenv"; // Para cargar variables de entorno
import * as path from "path"; // Para construir rutas de archivos

// --- Carga de Variables de Entorno ---
// Construye la ruta al archivo .env en la raíz del proyecto, asumiendo que este script
// se ejecuta desde la carpeta 'functions' o que el JS compilado estará en 'functions/lib/scripts'.
// __dirname se refiere al directorio del archivo JS *ejecutado* (ej: functions/lib/scripts)
const envPath = path.resolve(__dirname, "../../../.env");
const dotenvResult = config({ path: envPath });

if (dotenvResult.error) {
  console.warn(
    `Advertencia: No se pudo cargar el archivo .env desde ${envPath}. Asegúrate de que exista o que las variables de entorno estén configuradas globalmente. Error: ${dotenvResult.error.message}`
  );
} else {
  console.log(`Archivo .env cargado desde: ${envPath}`);
}

// --- Inicialización de Firebase Admin SDK con credenciales de .env ---
const projectId = process.env.REACT_APP_PROJECTID;
// Reemplaza los '\n' literales (escapados) con saltos de línea reales
const privateKey = process.env.REACT_APP_PRIVATEKEY?.replace(/\\n/g, "\n");
const clientEmail = process.env.REACT_APP_CLIENTEMAIL;
// Verifica que las credenciales se cargaron
if (!projectId || !privateKey) {
  console.error(
    "Error: Faltan credenciales de Firebase Admin en el archivo .env o en las variables de entorno."
  );
  console.error(
    "Asegúrate de que FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, y FIREBASE_PRIVATE_KEY estén definidas."
  );
  process.exit(1); // Termina el script si faltan credenciales
}

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: projectId,
      clientEmail: clientEmail,
      privateKey: privateKey,
    }),
    // Opcional: Especifica la URL de la base de datos si es necesario
    // databaseURL: `https://${projectId}.firebaseio.com`
  });
  console.log(
    "Firebase Admin SDK inicializado exitosamente usando credenciales de entorno."
  );
} catch (error: any) {
  console.error("Error inicializando Firebase Admin SDK:", error.message);
  process.exit(1);
}

const db: admin.firestore.Firestore = admin.firestore();

// --- Interfaces para Tipado ---
interface UserDocument {
  sequentialUserId?: number; // Campo que vamos a añadir/actualizar
  // Añade otros campos si necesitas leerlos
}

interface CounterDocument {
  lastId: number;
}

// --- Constantes de Configuración ---
const USERS_COLLECTION = "users";
const SEQUENTIAL_ID_FIELD = "sequentialUserId";
const STARTING_ID = 11001;
const BATCH_SIZE = 200; // Ajusta según necesidad y límites
const COUNTER_DOC_PATH = "counters/userSequence";
const COUNTER_FIELD = "lastId";
const DELAY_BETWEEN_BATCHES_MS = 500; // Pausa entre lotes (0 para deshabilitar)

// --- Función Principal del Script ---
async function assignSequentialIdsToExistingUsers(): Promise<void> {
  console.log(
    "Iniciando asignación de IDs secuenciales a usuarios existentes..."
  );
  console.log(
    `Usando configuración: StartID=${STARTING_ID}, BatchSize=${BATCH_SIZE}, Delay=${DELAY_BETWEEN_BATCHES_MS}ms`
  );

  let currentId = STARTING_ID;
  let lastProcessedDocSnapshot: QueryDocumentSnapshot<UserDocument> | null =
    null;
  let totalUsersProcessed = 0;
  let totalUsersChecked = 0;
  let lastSuccessfullyAssignedId = STARTING_ID - 1;

  const usersRef = db.collection(
    USERS_COLLECTION
  ) as admin.firestore.CollectionReference<UserDocument>;
  const counterRef = db.doc(
    COUNTER_DOC_PATH
  ) as admin.firestore.DocumentReference<CounterDocument>;

  try {
    while (true) {
      process.stdout.write(
        `\nProcesando lote... Iniciando después de doc ID: ${
          lastProcessedDocSnapshot?.id || "Inicio"
        } `
      );

      let query = usersRef
        .orderBy(admin.firestore.FieldPath.documentId())
        .limit(BATCH_SIZE);

      if (lastProcessedDocSnapshot) {
        query = query.startAfter(lastProcessedDocSnapshot);
      }

      const snapshot = await query.get();
      totalUsersChecked += snapshot.size; // Contar cuántos documentos se leyeron en este lote

      if (snapshot.empty) {
        process.stdout.write("\n"); // Nueva línea final
        console.log("No hay más usuarios para procesar.");
        break;
      }

      lastProcessedDocSnapshot = snapshot.docs[snapshot.docs.length - 1];

      const batch: WriteBatch = db.batch();
      let usersInBatchToUpdate = 0;

      snapshot.docs.forEach((doc: QueryDocumentSnapshot<UserDocument>) => {
        const userData = doc.data();
        // Solo actualizar si el campo no existe o es null/undefined
        if (
          userData[SEQUENTIAL_ID_FIELD] === undefined ||
          userData[SEQUENTIAL_ID_FIELD] === null
        ) {
          batch.update(doc.ref, { [SEQUENTIAL_ID_FIELD]: currentId });
          currentId++;
          usersInBatchToUpdate++;
        }
      });

      if (usersInBatchToUpdate > 0) {
        process.stdout.write(
          ` -> Actualizando ${usersInBatchToUpdate} usuarios... `
        );
        await batch.commit();
        lastSuccessfullyAssignedId = currentId - 1;
        totalUsersProcessed += usersInBatchToUpdate;
        process.stdout.write(
          `¡Hecho! (Total Proc: ${totalUsersProcessed}, Último ID: ${lastSuccessfullyAssignedId})`
        );

        if (DELAY_BETWEEN_BATCHES_MS > 0) {
          await new Promise((resolve) =>
            setTimeout(resolve, DELAY_BETWEEN_BATCHES_MS)
          );
        }
      } else {
        process.stdout.write(" -> Lote sin usuarios para actualizar.");
      }
    } // Fin while

    // --- Actualización Final del Contador ---
    console.log(
      `\n\nProceso completado. Total de documentos leídos: ${totalUsersChecked}. Total de usuarios actualizados: ${totalUsersProcessed}.`
    );

    if (totalUsersProcessed > 0) {
      console.log(
        `Actualizando el documento contador (${COUNTER_DOC_PATH}) con el último ID asignado: ${lastSuccessfullyAssignedId}`
      );
      await counterRef.set(
        { [COUNTER_FIELD]: lastSuccessfullyAssignedId },
        { merge: true }
      );
      console.log("¡Documento contador actualizado exitosamente!");
    } else {
      console.log(
        "No se procesaron nuevos usuarios, el documento contador no se modificó."
      );
    }
  } catch (error: any) {
    console.error("\n\nERROR durante el proceso de asignación:", error);
    console.error(
      `El proceso se detuvo. El último ID asignado con éxito podría haber sido: ${lastSuccessfullyAssignedId}.`
    );
    console.error(
      "Revisa el error, restaura desde backup si es necesario, y considera reanudar o corregir manualmente."
    );
    console.error(
      "El documento contador NO se ha actualizado al valor final si el error ocurrió antes del paso final."
    );
    // Lanzar el error para que el bloque final lo capture y salga con código 1
    throw error;
  }
}

// --- Ejecución del Script ---
assignSequentialIdsToExistingUsers()
  .then(() => {
    console.log("\nScript finalizado correctamente.");
    process.exit(0); // Salir exitosamente
  })
  .catch((error) => {
    // El error ya debería haber sido logueado en la función principal
    console.error("\nEl script terminó con errores.");
    process.exit(1); // Salir con código de error
  });

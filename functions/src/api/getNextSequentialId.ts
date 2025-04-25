import admin = require("firebase-admin");

interface CounterDocument {
  lastId: number;
}

/**
 * Obtiene el siguiente ID secuencial disponible de forma atómica,
 * actualizando el contador en Firestore.
 * @throws Error si el contador no existe o si se alcanza el límite.
 * @returns {Promise<number>} El siguiente ID secuencial.
 */
export const getNextSequentialId = async (): Promise<number> => {
  const COUNTER_DOC_PATH = "counters/userSequence";
  const COUNTER_FIELD = "lastId";
  const MAX_SEQUENTIAL_ID = 999999; // Límite de 6 dígitos
  const INITIAL_COUNTER_VALUE = 109999; // Para que el primero sea 110000
  const db = admin.firestore();
  const counterRef = db.doc(
    COUNTER_DOC_PATH
  ) as FirebaseFirestore.DocumentReference<CounterDocument>;
  let newSequentialId: number | null = null; // Usamos null para asegurar asignación

  try {
    await db.runTransaction(async (transaction) => {
      const counterDoc = await transaction.get(counterRef);

      if (!counterDoc.exists) {
        // Opcional: Podrías intentar inicializarlo aquí si es seguro en tu flujo
        // transaction.set(counterRef, { [COUNTER_FIELD]: INITIAL_COUNTER_VALUE });
        // newSequentialId = INITIAL_COUNTER_VALUE + 1;
        // Por ahora, lanzaremos error si no existe. Asegúrate de crearlo manualmente o con un script de inicialización.
        console.error(
          `Error crítico: El documento contador en ${COUNTER_DOC_PATH} no existe.`
        );
        throw new Error("ERR_COUNTER_NOT_FOUND");
      }

      const lastId = counterDoc.data()?.lastId ?? INITIAL_COUNTER_VALUE; // Usa valor inicial si falta
      const calculatedNextId = lastId + 1;

      if (calculatedNextId > MAX_SEQUENTIAL_ID) {
        console.error(
          `Error: Se ha alcanzado el límite de IDs secuenciales (${MAX_SEQUENTIAL_ID}). Último ID fue ${lastId}.`
        );
        throw new Error("ERR_ID_LIMIT_REACHED");
      }

      // Actualiza el contador DENTRO de la transacción
      transaction.update(counterRef, { [COUNTER_FIELD]: calculatedNextId });
      newSequentialId = calculatedNextId; // Asigna el nuevo ID calculado
    }); // Fin de la transacción

    if (newSequentialId === null) {
      // Esto no debería ocurrir si la transacción tiene éxito, pero es una salvaguarda
      throw new Error(
        "ERR_TRANSACTION_FAILED: No se pudo obtener el ID secuencial."
      );
    }

    return newSequentialId; // Devuelve el ID obtenido
  } catch (error) {
    // Loguea el error específico aquí si quieres más detalle
    console.error("Error en la transacción getNextSequentialId:", error);
    // Relanza el error para que el llamador (addUser) lo maneje
    throw error;
  }
};

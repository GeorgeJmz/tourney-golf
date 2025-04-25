import * as admin from "firebase-admin";
import { UserType } from "../types/User"; // Reutiliza tus tipos

// Función que encapsula la lógica de creación con ID secuencial
export const createUserService = async (
  userData: UserType
): Promise<{ userId: string; sequentialId: number }> => {
  const db = admin.firestore();
  const counterRef = db.collection("counters").doc("userSequence");
  const usersRef = db.collection(
    "users"
  ) as FirebaseFirestore.CollectionReference<UserType>;

  let newSequentialId: number;
  let newUserDocRef: FirebaseFirestore.DocumentReference<UserType>;

  try {
    await db.runTransaction(async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      if (!counterDoc.exists) {
        // Decide cómo manejar esto: error o inicialización
        throw new Error(
          "ERR_COUNTER_NOT_FOUND: Documento contador no encontrado!"
        );
      }

      const lastId = counterDoc.data()?.lastId ?? 109999;
      newSequentialId = lastId + 1;

      if (newSequentialId > 999999) {
        throw new Error(
          "ERR_ID_LIMIT_REACHED: Se ha alcanzado el límite de IDs de 6 dígitos."
        );
      }

      transaction.update(counterRef, { lastId: newSequentialId });

      const newUserRef = usersRef.doc();
      newUserDocRef = newUserRef;

      const newUserPayload: Omit<UserType, "createdAt"> & {
        createdAt: string;
      } = {
        name: userData.name,
        lastName: userData.lastName,
        email: userData.email,
        ghinNumber: userData.ghinNumber,
        activeTournaments: userData.activeTournaments || [],
        historyTournaments: userData.historyTournaments || [],
        id: userData.id,
        lastCourses: userData.lastCourses || [],
        sequentialUserId: newSequentialId,
        createdAt: new Date().toString(), // Usa FieldValue aquí
      };

      transaction.set(newUserRef, newUserPayload);
    }); // Fin de la transacción

    // Asegurarnos que las variables se asignaron (TypeScript puede necesitar '!')
    return {
      userId: newUserDocRef!.id,
      sequentialId: newSequentialId!,
    };
  } catch (error: any) {
    console.error("Error en createUserService:", error);
    // Relanza el error para que el manejador de ruta lo capture
    // Puedes personalizar el error si quieres manejarlo diferente en la ruta
    throw error;
  }
};

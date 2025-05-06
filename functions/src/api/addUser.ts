// src/handlers/userHandlers.ts

import { Response } from "express";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import * as DOMPurify from "isomorphic-dompurify";
// Asegúrate que UserType incluya sequentialUserId como opcional: sequentialUserId?: number
import type { RequestAddUser, UserType } from "../types/User";
import { sendMail } from "./sendMail";
// Importa el NUEVO servicio para obtener IDs
import { getNextSequentialId } from "./getNextSequentialId";

export const addUser = async (req: RequestAddUser, res: Response) => {
  const db = admin.firestore();
  const {
    name,
    lastName,
    email,
    id, // ID del request body
    activeTournaments,
    historyTournaments,
    ghinNumber,
  } = req.body;

  logger.info("addUser Request body", req.body, { structuredData: true });

  // --- Validación y Sanitización (sin cambios) ---
  if (!name || !lastName || !email || !id) {
    return res.status(400).send({
      status: "error",
      message: "Missing required fields (name, lastName, email, id)",
    });
  }
  if (typeof name !== "string" || name.length > 255) {
    return res
      .status(400)
      .send({ status: "error", message: "Invalid name format" });
  }
  const sanitizedEmail = DOMPurify.sanitize(email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
    return res
      .status(400)
      .send({ status: "error", message: "Invalid email format" });
  }
  const sanitizedId = DOMPurify.sanitize(id);
  const sanitizedName = DOMPurify.sanitize(name);
  const sanitizedLastname = DOMPurify.sanitize(lastName);
  const sanitizedGhinNumber = ghinNumber
    ? DOMPurify.sanitize(ghinNumber)
    : undefined;

  // --- Preparación de Email (sin cambios) ---
  const emailBody = {
    email: sanitizedEmail,
    subject: "Welcome to TEE BOX League",
    message:
      "<p>Now you're ready to practice with purpose, play with an edge and become a league legend.</p><p><a href='https://teeboxleague.com/'>Login</a> to create a new league or accept a league invitation.</p>",
  };

  // --- Lógica Principal ---
  try {
    const lowerCaseEmail = sanitizedEmail.toLowerCase();
    const userCollection = db.collection("users");
    const existUserQuery = await userCollection
      .where("email", "==", lowerCaseEmail)
      .limit(1)
      .get();

    // --- CASO: Usuario YA Existe ---
    if (!existUserQuery.empty) {
      const userDoc = existUserQuery.docs[0];
      const userData = userDoc.data() as UserType; // Castea a tu tipo UserType

      logger.info(
        `User with email ${lowerCaseEmail} already exists (Doc ID: ${userDoc.id}). Checking sequential ID...`,
        { structuredData: true }
      );

      const updatePayload: Partial<UserType> = {
        // Usamos Partial para construir el payload
        id: sanitizedId, // Siempre actualizamos el ID del request según tu lógica
        // Puedes añadir aquí otros campos que siempre deban actualizarse
        // name: sanitizedName,
        // lastName: sanitizedLastname,
        // ...etc.
      };
      let needsSequentialId = false;
      let newSeqId: number | undefined = undefined;

      // Verifica si necesita un ID secuencial
      if (
        userData.sequentialUserId === undefined ||
        userData.sequentialUserId === null ||
        userData.sequentialUserId <= 0
      ) {
        // Chequeo más robusto
        logger.info(
          `User ${userDoc.id} needs sequential ID. Getting next ID...`
        );
        needsSequentialId = true;
        try {
          newSeqId = await getNextSequentialId(); // Llama al servicio atómico
          updatePayload.sequentialUserId = newSeqId; // Añade el nuevo ID al payload
          logger.info(
            `Obtained sequential ID ${newSeqId} for user ${userDoc.id}.`
          );
        } catch (idError: any) {
          // Si falla la obtención del ID (límite alcanzado, contador no existe), loguea y falla la solicitud completa
          logger.error(
            `Failed to get sequential ID for existing user ${userDoc.id}:`,
            idError
          );
          // Decide si quieres devolver un error específico o el genérico de abajo
          if (idError.message?.includes("ERR_ID_LIMIT_REACHED")) {
            return res
              .status(400)
              .json({ status: "error", message: "Límite de IDs alcanzado." });
          }
          if (idError.message?.includes("ERR_COUNTER_NOT_FOUND")) {
            return res.status(500).json({
              status: "error",
              message: "Error de configuración interna (contador).",
            });
          }
          throw idError; // Relanza para que lo capture el catch principal
        }
      } else {
        logger.info(
          `User ${userDoc.id} already has sequential ID: ${userData.sequentialUserId}.`
        );
      }

      // Realizar la actualización del usuario existente
      logger.info(
        `Updating user doc ${userDoc.id} with payload:`,
        updatePayload
      );
      await userDoc.ref.update(updatePayload);

      // --- Actualizar colección 'players' (como antes) ---
      // Considera si esta parte también debería estar en una transacción o si requiere sequentialId
      const playersCollection = db.collection("player");
      const playersQuery = await playersCollection
        .where("email", "==", lowerCaseEmail)
        .get();
      const playerUpdatePromises: Promise<any>[] = [];
      playersQuery.forEach((doc) => {
        logger.info(`Updating player doc ${doc.id} with id: ${sanitizedId}`);
        // ¿Debería actualizarse también el sequentialUserId aquí si se generó uno?
        // const playerUpdatePayload = needsSequentialId ? { id: sanitizedId, sequentialUserId: newSeqId } : { id: sanitizedId };
        const playerUpdatePayload = { id: sanitizedId }; // Por ahora solo actualiza 'id'
        playerUpdatePromises.push(doc.ref.update(playerUpdatePayload));
      });
      await Promise.all(playerUpdatePromises);
      // --- Fin actualización 'players' ---

      await sendMail(emailBody.email, emailBody.subject, emailBody.message);

      return res.status(200).send({
        status: "success",
        message: needsSequentialId
          ? "User updated successfully and sequential ID assigned."
          : "User updated successfully.",
        data: {
          userId: userDoc.id,
          sequentialUserId: newSeqId ?? userData.sequentialUserId, // Devuelve el nuevo o el existente
        },
      });
    }
    // --- CASO: Usuario NO Existe ---
    else {
      logger.info(
        `User with email ${lowerCaseEmail} does not exist. Creating new user...`
      );

      let newSeqId: number;
      try {
        newSeqId = await getNextSequentialId(); // Obtiene el ID primero
        logger.info(`Obtained sequential ID ${newSeqId} for new user.`);
      } catch (idError: any) {
        // Falla la solicitud si no se puede obtener ID para el nuevo usuario
        logger.error(
          `Failed to get sequential ID for new user ${lowerCaseEmail}:`,
          idError
        );
        if (idError.message?.includes("ERR_ID_LIMIT_REACHED")) {
          return res
            .status(400)
            .json({ status: "error", message: "Límite de IDs alcanzado." });
        }
        if (idError.message?.includes("ERR_COUNTER_NOT_FOUND")) {
          return res.status(500).json({
            status: "error",
            message: "Error de configuración interna (contador).",
          });
        }
        throw idError; // Relanza para el catch principal
      }

      // Prepara el payload completo para el nuevo usuario
      // Nota: NO usamos el 'id' del request body aquí, usamos el sequentialUserId
      const newUserPayload: Omit<UserType, "uuid"> = {
        // Asumiendo que UserType no necesita uuid al crear
        name: sanitizedName,
        lastName: sanitizedLastname,
        email: sanitizedEmail, // Guarda el email sanitizado
        ghinNumber: sanitizedGhinNumber || "",
        activeTournaments: activeTournaments || [],
        historyTournaments: historyTournaments || [],
        lastCourses: [], // Campo de tu ejemplo original
        sequentialUserId: newSeqId, // Asigna el ID obtenido
        // Puedes añadir otros campos por defecto si es necesario
        id: sanitizedId, // Decidiste mantener el ID original también aquí
      };

      // Crea el nuevo documento
      const newUserRef = userCollection.doc(); // Firestore genera ID de documento
      await newUserRef.set({
        ...newUserPayload,
        createdAt: new Date().toString(), // Añade timestamp
      });

      logger.info(
        `New user created. Firestore ID: ${newUserRef.id}, Sequential ID: ${newSeqId}`
      );

      await sendMail(emailBody.email, emailBody.subject, emailBody.message);

      return res.status(201).send({
        status: "success",
        message: "New user added successfully with sequential ID.",
        data: {
          userId: newUserRef.id,
          sequentialUserId: newSeqId,
        },
      });
    }
  } catch (error: any) {
    // --- Manejo de Errores General ---
    logger.error("Error in addUser handler:", error, { structuredData: true });
    // Evita devolver el objeto de error directamente al cliente por seguridad
    return res.status(500).json({
      status: "error",
      message: "Ocurrió un error procesando la solicitud.",
      // message: error.message // Podrías devolver el mensaje si es seguro
    });
  }
};

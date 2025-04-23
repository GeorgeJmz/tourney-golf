// src/handlers/userHandlers.ts (o donde esté tu addUser)

// Mantén tus imports existentes
import { Response } from "express";
import * as logger from "firebase-functions/logger";
// Usa import para admin si tu proyecto es consistentemente TS/ESM
import * as admin from "firebase-admin";
import * as DOMPurify from "isomorphic-dompurify";
import type { RequestAddUser, UserType } from "../types/User"; // Asegúrate que UserType esté definida como espera el servicio
import { sendMail } from "./sendMail";
// Importa el nuevo servicio
import { createUserService } from "./createUserWithSecuential";

export const addUser = async (req: RequestAddUser, res: Response) => {
  // --- 1. Extracción de Datos y Validación Inicial ---
  const db = admin.firestore();
  const {
    name,
    lastName,
    email,
    id, // Este es el ID que viene del request body
    activeTournaments,
    historyTournaments, // Asegúrate que este campo exista en tu tipo RequestAddUser
    ghinNumber,
  } = req.body;

  logger.info("addUser Request body", req.body, { structuredData: true });

  // Validación de campos requeridos (como la tenías)
  if (!name || !lastName || !email || !id) {
    // Mantenemos 'id' como requerido según tu lógica original
    return res.status(400).send({
      status: "error",
      message: "Missing required fields (name, lastName, email, id)",
    });
  }
  // Otras validaciones (longitud, formato email - como las tenías)
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

  // --- 2. Sanitización ---
  const sanitizedId = DOMPurify.sanitize(id); // Sanitiza el ID del request
  const sanitizedName = DOMPurify.sanitize(name);
  const sanitizedLastname = DOMPurify.sanitize(lastName);
  const sanitizedGhinNumber = ghinNumber
    ? DOMPurify.sanitize(ghinNumber)
    : undefined; // Maneja ghin opcional

  // --- 3. Preparación de Email ---
  const emailBody = {
    email: sanitizedEmail,
    subject: "Welcome to TEE BOX League",
    message:
      "<p>Now you're ready to practice with purpose, play with an edge and become a league legend.</p><p><a href='https://teeboxleague.com/'>Login</a> to create a new league or accept a league invitation.</p>",
  };

  // --- 4. Lógica Principal (Verificar Existencia y Crear/Actualizar) ---
  try {
    const lowerCaseEmail = sanitizedEmail.toLowerCase();
    const userCollection = db.collection("users");
    const existUserQuery = await userCollection
      .where("email", "==", lowerCaseEmail)
      .limit(1) // Solo necesitamos saber si existe al menos uno
      .get();

    // --- CASO: Usuario YA Existe ---
    if (!existUserQuery.empty) {
      logger.info(
        `User with email ${lowerCaseEmail} already exists. Updating ID field.`,
        { structuredData: true }
      );

      // Mantenemos tu lógica original para actualizar el ID en users y players
      // Es importante notar que esto NO usa una transacción.
      const updatePromises: Promise<any>[] = [];

      // Actualizar 'id' en colección 'users' (para todos los que coincidan con el email)
      existUserQuery.docs.forEach((doc) => {
        logger.info(`Updating user doc ${doc.id} with id: ${sanitizedId}`);
        updatePromises.push(doc.ref.update({ id: sanitizedId }));
      });

      // Actualizar 'id' en colección 'players'
      const playersCollection = db.collection("player");
      const playersQuery = await playersCollection
        .where("email", "==", lowerCaseEmail)
        .get();

      playersQuery.forEach((doc) => {
        logger.info(`Updating player doc ${doc.id} with id: ${sanitizedId}`);
        updatePromises.push(doc.ref.update({ id: sanitizedId }));
      });

      // Esperar a que todas las actualizaciones terminen
      await Promise.all(updatePromises);

      // Enviar email de bienvenida (incluso si ya existía, según tu lógica original)
      await sendMail(emailBody.email, emailBody.subject, emailBody.message);

      // Responder éxito (usuario actualizado)
      // Considera si el mensaje y status son los más adecuados aquí (tal vez no fue "añadido")
      return res.status(200).send({
        status: "success",
        message: "User already existed, ID field updated.",
        // Podrías devolver algún dato del usuario actualizado si quisieras
      });
    }
    // --- CASO: Usuario NO Existe ---
    else {
      logger.info(
        `User with email ${lowerCaseEmail} does not exist. Creating new user with sequential ID.`,
        { structuredData: true }
      );

      // Prepara el objeto de datos para el servicio.
      // Nota: No incluimos el 'id' del request aquí. El servicio generará 'sequentialUserId'.
      const dataForService: UserType = {
        name: sanitizedName,
        lastName: sanitizedLastname,
        email: sanitizedEmail, // El servicio debe manejar el toLowerCase si es necesario al guardar
        ghinNumber: sanitizedGhinNumber || "",
        activeTournaments: activeTournaments || [], // Usar valor por defecto
        historyTournaments: historyTournaments || [], // Asegúrate que UserType lo incluya
        lastCourses: [],
        id: id || sanitizedEmail,
      };

      // Llama al servicio para crear el usuario y obtener el ID secuencial
      // createUserService maneja la transacción internamente.
      const newUserInfo = await createUserService(dataForService);

      logger.info(
        `User created via service. Firestore ID: ${newUserInfo.userId}, Sequential ID: ${newUserInfo.sequentialId}`,
        { structuredData: true }
      );

      // Envía el email de bienvenida
      await sendMail(emailBody.email, emailBody.subject, emailBody.message);

      // Responde éxito (usuario creado) - Usamos 201 Created
      return res.status(201).send({
        status: "success",
        message: "New user added successfully with sequential ID.",
        data: {
          userId: newUserInfo.userId, // ID del documento Firestore
          sequentialUserId: newUserInfo.sequentialId, // El nuevo ID secuencial
          // Podrías añadir otros datos del usuario si el servicio los devolviera
        },
      });
    }
  } catch (error: any) {
    // --- 5. Manejo de Errores ---
    logger.error("Error in addUser handler:", error, { structuredData: true });
    // Puedes personalizar la respuesta basada en el tipo de error si el servicio lanza errores específicos
    if (error.message?.includes("ERR_COUNTER_NOT_FOUND")) {
      return res.status(500).json({
        status: "error",
        message: "Error de configuración interna (contador).",
      });
    }
    if (error.message?.includes("ERR_ID_LIMIT_REACHED")) {
      return res
        .status(400)
        .json({ status: "error", message: "Límite de IDs alcanzado." });
    }
    // Error genérico
    return res.status(500).json({
      status: "error",
      message: "Ocurrió un error procesando la solicitud.",
    });
  }
};

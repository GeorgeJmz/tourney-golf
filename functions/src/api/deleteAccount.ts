import { Response } from "express";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import { RequestGetCourses } from "../types/Courses";
import { v4 as uuidv4 } from "uuid";
import { sendMail } from "./sendMail";

// Request esperado: { body: { userId: string } }
export const deleteAccount = async (req: RequestGetCourses, res: Response) => {
  const db = admin.firestore();
  const { userId } = req.body;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "Invalid userId" });
  }

  try {
    const usersSnapshot = await db
      .collection("users")
      .where("id", "==", userId)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      return res.status(404).json({ error: "User not found" });
    }

    const userDoc = usersSnapshot.docs[0];
    const userData = userDoc.data();

    const email = userData.email;
    let authUser;
    try {
      authUser = await admin.auth().getUserByEmail(email);
    } catch (authErr) {
      logger.error("User not found in Firebase Auth", { email, error: authErr });
      return res.status(404).json({ error: "User not found in Auth" });
    }

    await admin.auth().updateUser(authUser.uid, { disabled: true });

    await userDoc.ref.update({ disabled: true });

    return res.status(200).json({
      status: "success",
      message: "User account disabled (soft delete) successfully.",
    });
  } catch (error) {
    logger.error("Error disabling user account", { error });
    return res.status(500).json({ error: "Error disabling user account" });
  }
};

export const reactivateAccount = async (req: RequestGetCourses, res: Response) => {
  const db = admin.firestore();
  const { userId } = req.body;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "Invalid userId" });
  }

  try {
    // Buscar usuario en Firestore por id
    const usersSnapshot = await db
      .collection("users")
      .where("id", "==", userId)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      return res.status(404).json({ error: "User not found" });
    }

    const userDoc = usersSnapshot.docs[0];
    const userData = userDoc.data();

    // Buscar usuario en Auth por email
    const email = userData.email;
    let authUser;
    try {
      authUser = await admin.auth().getUserByEmail(email);
    } catch (authErr) {
      logger.error("User not found in Firebase Auth", { email, error: authErr });
      return res.status(404).json({ error: "User not found in Auth" });
    }

    // Reactivar usuario en Auth
    await admin.auth().updateUser(authUser.uid, { disabled: false });

    // Actualizar documento en Firestore
    await userDoc.ref.update({ disabled: false });

    return res.status(200).json({
      status: "success",
      message: "User account reactivated successfully.",
    });
  } catch (error) {
    logger.error("Error reactivating user account", { error });
    return res.status(500).json({ error: "Error reactivating user account" });
  }
};

export const requestAccountReactivation = async (req: { body: { email: string } }, res: Response) => {
  const db = admin.firestore();
  const { email } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Invalid email" });
  }

  try {
    // Buscar usuario en Firestore por email
    const usersSnapshot = await db
      .collection("users")
      .where("email", "==", email.toLowerCase())
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      return res.status(404).json({ error: "User not found" });
    }

    const userDoc = usersSnapshot.docs[0];
    const userData = userDoc.data();

    if (!userData.disabled) {
      return res.status(400).json({ error: "Account is not disabled" });
    }

    // Generar UUID y expiración (ej: 1 hora)
    const token = uuidv4();
    const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hora
    await db.collection("reactivationTokens").doc(token).set({
      email: email.toLowerCase(),
      expiresAt,
      used: false,
    });

    // Enviar email con link
    const link = `https://teeboxleague.com/reactivate-account?token=${token}`;
    const subject = "Reactivación de cuenta TEEBOX League";
    const body = `Haz click en el siguiente enlace para reactivar tu cuenta: <a href='${link}'>Reactivar cuenta</a>. Este enlace expirará en 1 hora.`;
    await sendMail(email, subject, body);

    return res.status(200).json({
      status: "success",
      message: "Reactivation email sent.",
    });
  } catch (error) {
    logger.error("Error in requestAccountReactivation", { error });
    return res.status(500).json({ error: "Error sending reactivation email" });
  }
};

export const reactivateAccountWithToken = async (req: { body: { token: string } }, res: Response) => {
  const db = admin.firestore();
  const { token } = req.body;

  if (!token || typeof token !== "string") {
    return res.status(400).json({ error: "Invalid token" });
  }

  try {
    // Buscar token en Firestore
    const tokenDoc = await db.collection("reactivationTokens").doc(token).get();
    if (!tokenDoc.exists) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }
    const tokenData = tokenDoc.data();
    if (!tokenData) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }
    if (tokenData.used) {
      return res.status(400).json({ error: "Token already used" });
    }
    if (Date.now() > tokenData.expiresAt) {
      return res.status(400).json({ error: "Token expired" });
    }
    const email = tokenData.email;
    // Buscar usuario en Firestore por email
    const usersSnapshot = await db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();
    if (usersSnapshot.empty) {
      return res.status(404).json({ error: "User not found" });
    }
    const userDoc = usersSnapshot.docs[0];
    // Buscar usuario en Auth por email
    let authUser;
    try {
      authUser = await admin.auth().getUserByEmail(email);
    } catch (authErr) {
      logger.error("User not found in Firebase Auth", { email, error: authErr });
      return res.status(404).json({ error: "User not found in Auth" });
    }
    // Reactivar usuario en Auth
    await admin.auth().updateUser(authUser.uid, { disabled: false });
    // Actualizar documento en Firestore
    await userDoc.ref.update({ disabled: false });
    // Marcar token como usado
    await tokenDoc.ref.update({ used: true });
    return res.status(200).json({
      status: "success",
      message: "User account reactivated successfully.",
    });
  } catch (error) {
    logger.error("Error in reactivateAccountWithToken", { error });
    return res.status(500).json({ error: "Error reactivating user account" });
  }
};

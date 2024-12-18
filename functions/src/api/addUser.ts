import { Response } from "express";
import * as logger from "firebase-functions/logger";
import admin = require("firebase-admin");
import * as DOMPurify from "isomorphic-dompurify";
import type { RequestAddUser } from "../types/User";
import { sendMail } from "./sendMail";

export const addUser = async (req: RequestAddUser, res: Response) => {
  const db = admin.firestore();
  const {
    name,
    lastName,
    email,
    id,
    activeTournaments,
    historyTournaments,
    ghinNumber,
  } = req.body;

  logger.info("Request body", { structuredData: true });
  logger.info(req.body, { structuredData: true });
  logger.info(name, { structuredData: true });
  logger.info(lastName, { structuredData: true });
  logger.info(email, { structuredData: true });
  logger.info(id, { structuredData: true });

  if (!name || !lastName || !email || !id) {
    res.status(400).send({
      status: "error",
      message: "Missing required fields",
    });
    return;
  }

  if (typeof name !== "string" || name.length > 255) {
    res.status(400).send({
      status: "error",
      message: "Invalid name format",
    });
    return;
  }

  // Sanitize data before storing
  const sanitizedEmail = DOMPurify.sanitize(email);
  const sanitizedId = DOMPurify.sanitize(id);
  const sanitizedName = DOMPurify.sanitize(name);
  const sanitizedLastname = DOMPurify.sanitize(lastName);
  const sanitizedGhinNumber = DOMPurify.sanitize(ghinNumber);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
    res.status(400).send({
      status: "error",
      message: "Invalid email format",
    });
    return;
  }

  const user = {
    name: sanitizedName,
    lastName: sanitizedLastname,
    email: sanitizedEmail,
    id: sanitizedId,
    ghinNumber: sanitizedGhinNumber,
    activeTournaments,
    historyTournaments,
  };

  try {
    const emailBody = {
      email: sanitizedEmail,
      subject: "Welcome to TEE BOX League",
      message:
        "<p>Now you're ready to practice with purpose, play with an edge and become a league legend.</p><p><a href='https://teeboxleague.com/'>Login</a> to create a new league or accept a league invitation.</p>",
    };
    const userCollection = db.collection("users");
    const existUser = await userCollection
      .where("email", "==", email.toLowerCase())
      .get();
    if (!existUser.empty) {
      const playersCollection = db.collection("player");
      const playersQuery = await playersCollection
        .where("email", "==", email.toLowerCase())
        .get();

      logger.info("User already exists", { structuredData: true });
      logger.info(existUser.docs, { structuredData: true });
      logger.info(playersQuery.docs, { structuredData: true });

      existUser.forEach(async (dc) => {
        await dc.ref.update({ id: sanitizedId });
      });

      playersQuery.forEach(async (dc) => {
        await dc.ref.update({ id: sanitizedId });
      });

      await sendMail(emailBody.email, emailBody.subject, emailBody.message);
      res.status(200).send({
        status: "success",
        message: "newUser added successfully",
        data: { newUserObject: user },
      });
      return;
    }
    const newUser = userCollection.doc();
    await newUser.set(user);
    await sendMail(emailBody.email, emailBody.subject, emailBody.message);
    res.status(200).send({
      status: "success",
      message: "newUser added successfully",
      data: { newUserObject: newUser },
    });
  } catch (error) {
    logger.error("Error adding User", { structuredData: true });
    logger.error(error, { structuredData: true });
    logger.error(user, { structuredData: true });
    res.status(500).json(error);
  }
};

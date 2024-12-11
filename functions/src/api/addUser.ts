import { Response } from "express";
import * as logger from "firebase-functions/logger";
import admin = require("firebase-admin");
import * as DOMPurify from "isomorphic-dompurify";

type EntryType = {
  name: string;
  lastname: string;
  email: string;
  id: string;
  activeTournaments: { tournamentId: string; tournamentName: string }[];
  historyTournaments: {
    tournamentId: string;
    tournamentName: string;
    result: string;
  }[];
};

type Request = {
  body: EntryType;
  params: { entryId: string };
};

export const addUser = async (req: Request, res: Response) => {
  const db = admin.firestore();
  const { name, lastname, email, id, activeTournaments, historyTournaments } =
    req.body;

  if (!name || !lastname || !email || !id) {
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
  const sanitizedLastname = DOMPurify.sanitize(lastname);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
    res.status(400).send({
      status: "error",
      message: "Invalid email format",
    });
    return;
  }

  const user = {
    name: sanitizedName,
    lastname: sanitizedLastname,
    email: sanitizedEmail,
    id: sanitizedId,
    activeTournaments,
    historyTournaments,
  };

  try {
    const entry = db.collection("users").doc();
    await entry.set(user);
    res.status(200).send({
      status: "success",
      message: "entry added successfully",
      data: { entryObject: entry },
    });
  } catch (error) {
    logger.error("Error adding User", { structuredData: true });
    logger.error(error, { structuredData: true });
    logger.error(user, { structuredData: true });
    res.status(500).json(error);
  }
};

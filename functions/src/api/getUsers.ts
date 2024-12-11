import { Response } from "express";
import admin = require("firebase-admin");

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
  uuid?: string;
};

type Request = {
  body: EntryType;
  params: { entryId: string };
};

export const getUsers = async (req: Request, res: Response) => {
  const db = admin.firestore();
  try {
    const allUsers = await db.collection("users").get();
    const users: EntryType[] = [];
    allUsers.forEach((doc) => {
      const user = {
        ...doc.data(),
        uuid: doc.id,
      };
      users.push(user as EntryType);
    });
    return res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (error) {
    return res.status(500).json("We found an error fetching your request!");
  }
};

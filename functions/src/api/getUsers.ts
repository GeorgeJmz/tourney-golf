import { Response } from "express";
import admin = require("firebase-admin");
import type { RequestGetUsers, UserType } from "../types/User";
import * as DOMPurify from "isomorphic-dompurify";

export const getUsers = async (req: RequestGetUsers, res: Response) => {
  const db = admin.firestore();
  const sanitizedEmail = DOMPurify.sanitize(req.query.email);

  try {
    const allUsers = sanitizedEmail
      ? await db.collection("users").where("email", "==", sanitizedEmail).get()
      : await db.collection("users").get();
    const users: UserType[] = [];
    allUsers.forEach((doc) => {
      const user = {
        ...doc.data(),
        uuid: doc.id,
      };
      users.push(user as UserType);
    });
    return res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (error) {
    return res.status(500).json("We found an error fetching your request!");
  }
};

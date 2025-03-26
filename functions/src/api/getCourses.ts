import { Response } from "express";
import admin = require("firebase-admin");
import * as logger from "firebase-functions/logger";
import { RequestGetCourses } from "../types/Courses";
import { getFullCourses } from "../helpers/courses";
import { UserType } from "../types/User";

export const getCourses = async (req: RequestGetCourses, res: Response) => {
  const db = admin.firestore();
  const { userId } = req.body;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "Invalid userId" });
  }

  try {
    const usersSnapshot = await db
      .collection("users")
      .where("id", "==", userId)
      .get();

    if (usersSnapshot.empty) {
      return res.status(404).json({ error: "User not found" });
    }

    const currentUser = usersSnapshot.docs[0].data() as UserType;

    return res.status(200).json({
      status: "success",
      data: {
        courses: getFullCourses(),
        lastCourses: currentUser.lastCourses,
        userId: userId,
      },
    });
  } catch (error) {
    logger.error("Error fetching standings", { error });
    return res
      .status(500)
      .json({ error: "We found an error fetching your request!" });
  }
};

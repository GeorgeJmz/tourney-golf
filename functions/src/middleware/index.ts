import * as express from "express";
import admin = require("firebase-admin");
import * as logger from "firebase-functions/logger";

export const verifyToken = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  const token = authorization.split(" ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Attach decoded user info to the request object
    next();
  } catch (error) {
    console.error("Error verifying custom token:", error);
    return res.status(403).send({ message: "Forbidden" });
  }
};

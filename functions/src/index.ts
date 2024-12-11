/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as express from "express";

/* eslint-disable */
const functions = require("firebase-functions");
const admin = require("firebase-admin");

const addUsers = require("./api/addUser");
const getUsers = require("./api/getUsers");

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

admin.initializeApp();

async function verifyCustomToken(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
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
}

//Create and Deploy Your First Cloud Functions
export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs Adrian!", { structuredData: true });
  response.send("<p>Hello from Firebase! is Working</p>");
});

//Events
exports.onFinishLeague = require("./events/onFinishLeague").onFinishLeague;
exports.onCreateMatch = require("./events/onCreateMatch").onCreateMatch;

//API
const api = express();
api.get("/", (req, res) => res.status(200).send("Hey there!"));
api.post("/addUser", verifyCustomToken, addUsers.addUser); // Wrap with middleware
api.get("/getUsers", getUsers.getUsers); // Wrap with middleware

exports.app = functions.https.onRequest(api);

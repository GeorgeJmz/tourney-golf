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

/* eslint-disable */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const routes = require("./routes");
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

admin.initializeApp();

//Create and Deploy Your First Cloud Functions
export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs Adrian!", { structuredData: true });
  response.send("<p>Hello from Firebase! is Working</p>");
});

//Events
exports.onFinishLeague = require("./events/onFinishLeague").onFinishLeague;
exports.onCreateMatch = require("./events/onCreateMatch").onCreateMatch;
exports.onUpdatePlayer = require("./events/onUpdatePlayer").onUpdatePlayer;

//API
exports.api = functions.https.onRequest(routes);

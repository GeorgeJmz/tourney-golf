/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

import * as express from "express";


/* eslint-disable */
const functions = require("firebase-functions");
const admin = require("firebase-admin");



// Start writing functions
// https://firebase.google.com/docs/functions/typescript


admin.initializeApp();

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs Adrian!", { structuredData: true });
  response.send("<p>Hello from Firebase! is Working</p>");
});

export const addUser = onRequest((request, response) => {
  logger.info("Hello logs Adrian!", { structuredData: true });
  logger.info(request, { structuredData: true });
  response.send("<p>Hello from Firebase! is Working</p>");
});


exports.onFinishLeague = require("./events/onFinishLeague").onFinishLeague;
exports.onCreateMatch = require("./events/onCreateMatch").onCreateMatch;


const api = express();
api.get('/', (req, res) => res.status(200).send('Hey there!'));
exports.app = functions.https.onRequest(api);

// export const createMultipleMockAccounts = onRequest(
//   async (request, response) => {
//     const users = [
//       {
//         email: "jeckox@gmail.com",
//         name: "Adrian",
//         lastName: "Aburto",
//         password: "Password12345",
//       },
//       {
//         email: "jeckox@emulator.com",
//         name: "Adrian 2",
//         lastName: "Aburto 2",
//         password: "Password12345",
//       },
//       {
//         email: "danuapp@emulator.com",
//         name: "Dani ",
//         lastName: "Cuenca 2",
//         password: "Password12345",
//       },
//     ];
//     const league = {
//       id: "vpkBSnS56W2zMvrHp0OM",
//       author: "nYXoqIHfCnJKljG2Nj2P024U4W0u",
//       name: "AdriTest",
//       tournamentType: "league",
//       players: 0,
//       groups: 0,
//       playersList: [
//         {
//           conference: "conference1",
//           name: "Adri",
//           id: "jeckox@gmail.com",
//           email: "jeckox@gmail.com",
//           group: "group1",
//         },
//         {
//           conference: "conference1",
//           name: "Test",
//           id: "jeckox@emulator.com",
//           email: "jeckox@emulator.com",
//           group: "group1",
//         },
//         {
//           conference: "conference1",
//           name: "Dani",
//           id: "danuapp@gmail.com",
//           email: "danuapp@gmail.com",
//           group: "group1",
//         },
//       ],
//       groupsList: [
//         {
//           conference: "conference1",
//           name: "group 1",
//           id: "group1",
//         },
//       ],
//       teamsList: [],
//       conferencesList: [
//         {
//           name: "conference 1",
//           id: "conference1",
//         },
//       ],
//       playersPerGroup: [],
//       teams: [],
//       playType: "strokePlay",
//       playOffs: false,
//       startDate: "2024-05-24T01:34:22.314Z",
//       cutOffDate: "2024-11-20T01:34:03.681Z",
//       matchesPerRound: ["double"],
//       conference: [],
//       status: "draft",
//       pointsPerWin: 3,
//       pointsPerTie: 1,
//       pointsPerWinMedal: 3,
//       pointsPerTieMedal: 1,
//     };
//     users.forEach(async (user) => {
//       const credentials = await admin
//         .auth()
//         .createUser({
//           email: user.email,
//           password: user.password,
//         })
//         .then(async (userRecord) => {
//           // See the UserRecord reference doc for the contents of userRecord.
//           console.log("Successfully created new user:", userRecord.uid);
//           const firebaseUser = {
//             email: user.email.toLowerCase(),
//             id: userRecord.uid,
//             name: user.name,
//             lastName: user.lastName,
//             activeTournaments: [],
//             handicap: 0,
//             ghinNumber: "",
//           };
//           await admin.firestore().collection("users").add(firebaseUser);
//           return userRecord;
//         });

//       logger.info("Credentials ---", { structuredData: true });
//       logger.info(credentials, { structuredData: true });
//     });
//     await admin.firestore().collection("tournament").add(league);

//     response.send("Users created successfully");
//   }
// );

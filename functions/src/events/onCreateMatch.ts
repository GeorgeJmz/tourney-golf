import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import admin = require("firebase-admin");
import { IMatchResults } from "../types/Match";

exports.onCreateMatch = onDocumentCreated("match/{matchId}", async (event) => {
  const matchData = event.data?.data();
  const matchResults = matchData?.matchResults;
  const tournamentId = matchData?.tournamentId;

  // Update tournament lastActivityDate
  if (tournamentId) {
    try {
      const tournamentRef = admin
        .firestore()
        .collection("tournament")
        .where("id", "==", tournamentId)
        .limit(1);

      const tournamentSnapshot = await tournamentRef.get();

      if (!tournamentSnapshot.empty) {
        const tournamentDoc = tournamentSnapshot.docs[0];
        await tournamentDoc.ref.update({
          lastActivityDate: admin.firestore.FieldValue.serverTimestamp(),
        });

        logger.info(
          `✅ Updated lastActivityDate for tournament ${tournamentId}`
        );
      }
    } catch (error) {
      logger.error("Error updating tournament lastActivityDate:", error);
      // No lanzar error para no romper la creación del match
    }
  }

  // Update user lastCourses
  matchResults.forEach(async (matchResult: IMatchResults) => {
    const userId = matchResult.idPlayer;
    //   logger.info("MatchResults ---", { structuredData: true });
    //   logger.info(userId, { structuredData: true });
    await admin
      .firestore()
      .collection("users")
      .where("email", "==", userId)
      .get()
      .then((querySnapshot) => {
        //   logger.info("QuerySnapshot ---", { structuredData: true });
        //   logger.info(querySnapshot, { structuredData: true });
        querySnapshot.forEach((doc) => {
          // logger.info("Doc ---", { structuredData: true });
          // logger.info(doc, { structuredData: true });

          const userData = doc.data();
          // logger.info("UserData ---", { structuredData: true });
          // logger.info(userData, { structuredData: true });
          const lastCourses = new Set(userData.lastCourses || []);
          lastCourses.add(matchData?.course);
          const updatedUserData = {
            ...userData,
            lastCourses:
              lastCourses.size > 5
                ? Array.from(lastCourses).slice(1)
                : Array.from(lastCourses),
          };

          doc.ref.update(updatedUserData);

          // logger.info("UpdatedUserData ---", { structuredData: true });
          logger.info(updatedUserData, { structuredData: true });
        });
      });
  });
});

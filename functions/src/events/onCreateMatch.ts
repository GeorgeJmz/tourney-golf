import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import admin = require("firebase-admin");
import { IMatchResults } from "../types/Match";

exports.onCreateMatch = onDocumentCreated("match/{matchId}", async (event) => {
  const matchData = event.data?.data();
  const matchResults = matchData?.matchResults;

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

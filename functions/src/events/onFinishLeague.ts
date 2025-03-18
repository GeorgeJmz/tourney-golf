import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import admin = require("firebase-admin");

exports.onFinishLeague = onDocumentUpdated(
  "tournament/{tournamentId}",
  async (event) => {
    const previousValue = event.data?.before.data();
    const newValue = event.data?.after.data();
    const isFinished =
      previousValue?.status !== "closed" && newValue?.status === "closed";
    if (isFinished) {
      logger.info(`Tournament finished - ${previousValue?.name}`, {
        structuredData: true,
      });

      const emails = newValue?.playersList.map((player: any) => player.email);
      const tournamentId = event.data?.before.id;
      const maxEmails = 10;
      const emailsSeparated = emails.reduce(
        (acc: any, email: any, index: any) => {
          const lastPositon = acc.length - 1;
          if (acc[lastPositon] && acc[lastPositon].length < maxEmails) {
            acc[lastPositon].push(email);
            return acc;
          }
          acc.push([email]);
          return acc;
        },
        []
      );

      emailsSeparated.forEach(async (mails: any) => {
        await admin
          .firestore()
          .collection("users")
          .where("email", "in", mails)
          .get()
          .then((querySnapshot: any) => {
            querySnapshot.forEach((doc: any) => {
              const userData = doc.data();
              const historyTournaments = new Set(
                userData.historyTournaments || []
              );
              const activeTournaments = userData.activeTournaments || [];
              const newAdded = {
                activeTournaments: activeTournaments.filter(
                  (tournament: string) => tournament !== tournamentId
                ),
                historyTournaments: [
                  ...new Set([...historyTournaments, tournamentId]),
                ],
              };

              logger.info(newAdded, { structuredData: true });
              doc.ref.update(newAdded);
            });
          });
      });
    }
  }
);

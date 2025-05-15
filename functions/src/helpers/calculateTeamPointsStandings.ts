import { convertDate, getFormattedDate } from "../helpers/getFormattedDate";
import type { ITournament, ITournamentPlayer } from "../types/DashboardLeagues";
import admin = require("firebase-admin");

export const calculateTeamPointsStandings = async (
  teams: { [key: string]: Array<ITournamentPlayer> },
  leagueId: string
) => {
  const db = admin.firestore();

  const assignCurrentStage = async () => {
    const { formattedDate } = getFormattedDate();
    const currentDate = formattedDate;
    const tournamentRef = db
      .collection("tournament")
      .where("id", "==", leagueId)
      .limit(1);
    const tournamentSnapshot = await tournamentRef.get();
    const currentTournament = tournamentSnapshot.docs[0].data() as ITournament;
    let dateRange = {
      start: "",
      end: "",
    };
    let stats = "";
    currentTournament?.stagesDates?.forEach((date, index) => {
      const startDate = convertDate(date.start, "MM/DD/YYYY");
      const endDate = convertDate(date.end, "MM/DD/YYYY");
      if (currentDate >= startDate && currentDate <= endDate) {
        stats = index.toString();
        dateRange = {
          start: startDate,
          end: endDate,
        };
      }
    });

    if (
      currentTournament?.championshipDate &&
      convertDate(currentTournament?.championshipDate, "MM/DD/YYYY") ==
        currentDate
    ) {
      stats = "champ";
      dateRange = {
        start: currentDate,
        end: currentDate,
      };
    }
    const finalTeams = [];
    for (const team in teams) {
      const dates = Array.from({
        length: currentTournament.numberOfStages ?? 0,
      }).map((_, index) => {
        return {
          start: convertDate(
            currentTournament.stagesDates?.[index]?.start ?? "",
            "MM/DD/YYYY"
          ),
          end: convertDate(
            currentTournament.stagesDates?.[index]?.end ?? "",
            "MM/DD/YYYY"
          ),
        };
      });
      const teamName =
        currentTournament.teamsList?.find((t) => t.id === team)?.name || "";
      const roundsPlayed = teams[team].reduce(
        (acc, curr) => acc + curr.pointsTeam.length,
        0
      );
      const points = teams[team].reduce(
        (acc, curr) =>
          acc +
          curr.pointsTeam.reduce((a, c, index) => {
            const matchDate = curr.date?.[index] ?? "";
            if (matchDate >= dateRange.start && matchDate <= dateRange.end) {
              return a > c ? a : c;
            }
            return a;
          }, 0),
        0
      );

      const getPointsTopStagePerPlayer = (player: ITournamentPlayer) => {
        const getPointsPerState = dates
          .map((date) => {
            return player.pointsTeam.reduce<Array<number>>(
              (acc, curr, index) => {
                const matchDate = player.date?.[index] ?? "";
                if (matchDate >= date.start && matchDate <= date.end) {
                  return [...acc, curr];
                }
                return acc;
              },
              []
            );
          })
          .flat();

        const topStage = `${getPointsPerState.reduce(
          (acc, curr) => (acc > curr ? acc : curr),
          0
        )}`;
        return topStage;
      };

      const getPointsPerPlayer = (player: ITournamentPlayer) => {
        return player.pointsTeam.reduce((acc, curr, index) => {
          const matchDate = player.date?.[index] ?? "";
          if (matchDate >= dateRange.start && matchDate <= dateRange.end) {
            return acc > curr ? acc : curr;
          }
          return acc;
        }, 0);
      };
      const getOrderedPlayers = () => {
        const teamsSortedByChamp = [...teams[team]].sort((a, b) => {
          const champPoints = getPointsPerPlayer(a);
          const champPointsB = getPointsPerPlayer(b);
          if (champPointsB === champPoints) {
            const topStageA = getPointsTopStagePerPlayer(a);
            const topStageB = getPointsTopStagePerPlayer(b);
            return Number(topStageB) - Number(topStageA);
          }
          return champPointsB - champPoints;
        });
        return teamsSortedByChamp;
      };

      const teamSorted =
        stats === "champ" ? getOrderedPlayers().slice(0, 2) : teams[team];

      const newTeam = {
        name: teamName,
        playersNames: teamSorted.map((player) => player.name).join(" | "),
        pointsPerPlayer: teamSorted
          .map((player) =>
            stats === "champ"
              ? `${getPointsTopStagePerPlayer(player)} | ${getPointsPerPlayer(
                  player
                )}`
              : getPointsPerPlayer(player)
          )
          .join(", "),
        roundsPlayed,
        points:
          stats === "champ"
            ? teamSorted.reduce(
                (acc, next) =>
                  parseInt(getPointsTopStagePerPlayer(next).toString()) +
                  parseInt(getPointsPerPlayer(next).toString()) +
                  acc,
                0
              )
            : points,
      };
      finalTeams.push(newTeam);
    }
    const finalTeamsSorted = finalTeams
      .sort((a, b) => b.points - a.points)
      .filter((team, i) => i < 3)
      .map((t, i) => ({
        tourneyName: t.name,
        totalPoints: t.points,
        position: i + 1,
      }));
    return finalTeamsSorted;
  };
  const standings = await assignCurrentStage();
  return standings;
};

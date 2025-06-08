import { ITournament } from "../types/DashboardLeagues";
import admin = require("firebase-admin");
import { ITournamentPlayer, IUser } from "../types/Standings";
import { IMatch } from "../types/Match";
import { getCourseDetail } from "../helpers/courses";

export const createStatistics = async (leagueId: string) => {
  const db = admin.firestore();
  const [tournamentsSnapshot, playersSnapshot, matchesSnapshot] =
    await Promise.all([
      db.collection("tournament").where("id", "==", leagueId).get(),
      db.collection("player").where("tournamentId", "==", leagueId).get(),
      db.collection("match").where("tournamentId", "==", leagueId).get(),
    ]);
  const currentLeague = tournamentsSnapshot.docs[0].data() as ITournament;
  const {
    tournamentType,
    playType,
    pointsPerTie,
    pointsPerWin,
    pointsPerTieMedal,
    pointsPerWinMedal,
  } = currentLeague;

  const isLTMATCH =
    tournamentType === "leagueteamplay" && playType === "matchplaystableford";
  const isLTMEDAL =
    tournamentType === "leagueteamplay" && playType === "medalplaystableford";
  const isLMATCH = tournamentType === "league" && playType === "matchPlay";
  const isLMEDAL = tournamentType === "league" && playType === "strokePlay";
  const isDogFight = tournamentType === "dogfight";
  const isTeamPlay = tournamentType === "teamplay";

  const players: ITournamentPlayer[] = playersSnapshot.docs.map((doc) => ({
    ...(doc.data() as ITournamentPlayer),
    id: doc.id,
  }));

  const matches: IMatch[] = matchesSnapshot.docs.map((doc) => ({
    ...(doc.data() as IMatch),
    id: doc.id,
  }));

  const emails = players.map((player) => player.email);

  const users: IUser[] = [];
  const chunkSize = 30;

  for (let i = 0; i < emails.length; i += chunkSize) {
    const chunk = emails.slice(i, i + chunkSize);
    const usersSnapshot = await db
      .collection("users")
      .where("email", "in", chunk)
      .get();
    usersSnapshot.forEach((doc) => {
      users.push(doc.data() as IUser);
    });
  }

  const nameMap = new Map(
    users.map((user) => [user.email, `${user.name} ${user.lastName}`])
  );

  const playersWithNames = players.map((player) => ({
    ...player,
    name: nameMap.get(player.email) || player.name,
  }));

  // Process stats for sortedStats
  const processedStats: {
    [key: string]: {
      [key: string]: Array<{
        player: string;
        date: string;
        hdc: string;
        net: number;
        score: string;
        course: number;
        points: string;
        opponent: string;
      }>;
    };
  } = {};

  matches.forEach((match) => {
    match.matchResults.forEach((player, i) => {
      const id = player.idPlayer;
      const moreData = playersWithNames.find((p) => p.email === id);
      const currentPosition = moreData?.scoreId.findIndex(
        (s) => s === match.scoresId[i]
      );
      const currentConference = moreData?.conference || "";

      const getTotalPoints = (player: {
        pointsMatch: number;
        pointsStroke: number;
        bonusPoints: number;
      }) => {
        if (isLTMATCH || isLMATCH) {
          return player.pointsMatch + player.bonusPoints;
        }
        if (isLTMEDAL || isLMEDAL) {
          return player.pointsStroke + player.bonusPoints;
        }
        return player.pointsMatch + player.pointsStroke + player.bonusPoints;
      };
      const values = {
        player: moreData?.name || "",
        date: moreData?.date?.[currentPosition || 0] || "",
        hdc: `${player.hcp}`,
        net:
          player.score -
          getCourseDetail(match.teeBox).par.reduce(
            (acc, curr) => acc + curr,
            0
          ),
        score: match.scoresId[i],
        points: getTotalPoints({
          pointsMatch: moreData?.pointsMatch[currentPosition || 0] || 0,
          pointsStroke: moreData?.pointsStroke[currentPosition || 0] || 0,
          bonusPoints:
            moreData?.bonusPoints !== undefined
              ? moreData?.bonusPoints[currentPosition || 0] || 0
              : 0,
        }).toString(),
        course: getCourseDetail(match.teeBox).par.reduce(
          (acc, curr) => acc + curr,
          0
        ),
        opponent:
          nameMap.get(moreData?.opponent[currentPosition || 0] || "") || "",
      };

      if (!processedStats[currentConference]) {
        processedStats[currentConference] = {};
      }
      if (processedStats[currentConference][id]) {
        processedStats[currentConference][id].push(values);
      } else {
        processedStats[currentConference][id] = [values];
      }
    });
  });
  // Sort the stats
  const sortedStats = Object.entries(processedStats).reduce(
    (acc, [conference, stats]) => {
      acc[conference] = Object.values(stats)
        .sort((a, b) => a[0].player.localeCompare(b[0].player))
        .map((items) => {
          const sortedItems = items
            .slice()
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );
          return {
            player: sortedItems[0].player,
            date: sortedItems.map((item) => item.date),
            hdc: sortedItems.map((item) => `${item.hdc}`),
            net: sortedItems.map((item) => item.net),
            score: sortedItems.map((item) => item.score),
            points: sortedItems.map((item) => item.points),
            course: sortedItems.map((item) => item.course),
            opponent: sortedItems.map((item) => item.opponent),
          };
        });
      return acc;
    },
    {} as {
      [key: string]: Array<{
        player: string;
        date: string[];
        hdc: string[];
        net: number[];
        score: string[];
        points: string[];
        course: number[];
        opponent: string[];
      }>;
    }
  );
  const calculatePlayerStats = async (player: ITournamentPlayer) => {
    const getAverage = (values: number[]) => {
      const sum = values.reduce((acc, curr) => acc + curr, 0);
      return sum > 0 ? (sum / values.length).toFixed(1) : "0";
    };

    const calculatePoints = (
      pointsArray: number[],
      winPoint: number,
      tiePoint: number
    ) => {
      const wins = pointsArray.filter((point) => point === winPoint).length;
      const draws = pointsArray.filter((point) => point === tiePoint).length;
      const losses = pointsArray.filter((point) => point === 0).length;
      const total = pointsArray.reduce((acc, curr) => acc + curr, 0);
      return { wins, draws, losses, total };
    };

    const matchPoints = calculatePoints(
      player.pointsMatch,
      pointsPerWin,
      pointsPerTie
    );
    const strokePoints = calculatePoints(
      player.pointsStroke,
      pointsPerWinMedal,
      pointsPerTieMedal
    );

    const bonusPoints = player.bonusPoints
      ? player.bonusPoints.reduce((acc, curr) => acc + curr, 0)
      : 0;

    const totalPoints =
      isLTMATCH || isLMATCH
        ? matchPoints.total + bonusPoints
        : isLTMEDAL || isLMEDAL
        ? strokePoints.total + bonusPoints
        : matchPoints.total + strokePoints.total + bonusPoints;

    return {
      id: player.id,
      tourneyName: player.name,
      matchesPlayed:
        playType !== "matchstrokePlay"
          ? player.opponent.length
          : player.opponent.length * 2,
      wins: isLTMATCH || isLMATCH ? matchPoints.wins : strokePoints.wins,
      draws: isLTMATCH || isLMATCH ? matchPoints.draws : strokePoints.draws,
      losses: isLTMATCH || isLMATCH ? matchPoints.losses : strokePoints.losses,
      bonusPoints: bonusPoints,
      matchPoints: matchPoints.total,
      medalPoints: strokePoints.total,
      totalPoints: totalPoints,
      grossAverage: getAverage(
        player.gross.map((value) => parseInt(value.toString()))
      ),
      handicapAverage: getAverage(
        player.handicap.map((value) => parseInt(value.toString()))
      ),
      netAverage: getAverage(
        player.net.map((value) => parseInt(value.toString()))
      ),
      teamPoints: player.pointsTeam.reduce((acc, curr) => acc + curr, 0),
      conference: player.conference,
      group: player.group,
    };
  };

  const newPlayers = await Promise.all(
    playersWithNames.map(calculatePlayerStats)
  );

  const sortedPlayers = !isDogFight
    ? newPlayers.sort((a, b) => b.totalPoints - a.totalPoints)
    : newPlayers
        .sort((a, b) => {
          const aNet = parseInt(a.netAverage);
          const bNet = parseInt(b.netAverage);
          if (aNet > 0 && bNet > 0) {
            return bNet - aNet;
          }
          if (aNet <= 0 && bNet <= 0) {
            return 0;
          }
          return aNet - bNet;
        })
        .reverse();

  const teams: { [key: string]: Array<ITournamentPlayer> } =
    playersWithNames?.reduce((acc, curr) => {
      const team = curr.team;
      if (!acc[team]) {
        acc[team] = [];
      }
      acc[team].push(curr);
      return acc;
    }, {} as { [key: string]: Array<ITournamentPlayer> });

  const statisticsCollection = db.collection("statistics");
  const newStatistics = statisticsCollection.doc(leagueId);
  const statisticsObject = {
    players: isTeamPlay ? teams : sortedPlayers,
    tournamentType: tournamentType,
    ...(isTeamPlay ? {} : { stats: sortedStats }),
  };
  try {
    await newStatistics.set(statisticsObject);
  } catch (error) {
    console.log(error, "Error creating statistics at createStatistics");
  }
  return statisticsObject;
};

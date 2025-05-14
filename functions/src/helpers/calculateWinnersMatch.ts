import { Score } from "../types/Match";

interface TournamentInfo {
  tournamentType: string;
  playType: string;
}

interface Player {
  score: Omit<
    Score,
    "teamPoints" | "teamScoreHolesHP" | "totalGross" | "handicap" | "in" | "out"
  >;
}

interface CalculationOutput {
  calculatedWinnerMedalPlay: string[];
  calculatedWinnerMatch: string[];
  calculatedWinByHole: string[];
  calculatedMatchWinner: string;
}

export const calculateNewWinners = (
  tournamentInfo: TournamentInfo,
  playersList: [Player, Player]
): CalculationOutput => {
  const tournamentType = tournamentInfo.tournamentType;
  const playType = tournamentInfo.playType;

  const isLTMATCH =
    tournamentType === "leagueteamplay" && playType === "matchPlay";
  const isLTMEDAL =
    tournamentType === "leagueteamplay" && playType === "strokePlay";
  const isLMATCH = tournamentType === "league" && playType === "matchPlay";
  const isLMEDAL = tournamentType === "league" && playType === "strokePlay";

  const winByHoleResults: Array<string> = [];
  let currentMatchResult = 0;

  let winnerMedalPlayIds: string[] = [];

  let winnerMatchIds: string[] = [];

  let strokePlayWinnerDescription = "";

  let matchPlayWinnerDescription = "";

  for (let index = 0; index < 18; index++) {
    const playerA = playersList[0];
    const playerB = playersList[1];

    if (playerA.score.totalNet === playerB.score.totalNet) {
      strokePlayWinnerDescription = "Medal Play Draw";
    } else {
      strokePlayWinnerDescription =
        (playerA.score.totalNet < playerB.score.totalNet
          ? playerA.score.player
          : playerB.score.player) + " wins Medal Play";
    }

    const scoreA_gross = playerA.score.scoreHoles[index];
    const scoreA_hp = playerA.score.scoreHolesHP[index];
    const scoreB_gross = playerB.score.scoreHoles[index];
    const scoreB_hp = playerB.score.scoreHolesHP[index];

    let netScoreA: number | undefined | null = scoreA_gross;
    if (
      typeof scoreA_gross === "number" &&
      typeof scoreA_hp === "number" &&
      scoreA_hp !== 0
    ) {
      if (scoreA_hp && scoreA_gross) {
        netScoreA = scoreA_gross - scoreA_hp;
      } else {
        netScoreA = scoreA_gross;
      }
    }

    let netScoreB: number | undefined | null = scoreB_gross;
    if (
      typeof scoreB_gross === "number" &&
      typeof scoreB_hp === "number" &&
      scoreB_hp !== 0
    ) {
      if (scoreB_hp && scoreB_gross) {
        netScoreB = scoreB_gross - scoreB_hp;
      } else {
        netScoreB = scoreB_gross;
      }
    }

    if (netScoreA === netScoreB) {
      // TODO: Add logic for draw
    } else if (
      typeof netScoreA === "number" &&
      typeof netScoreB === "number" &&
      netScoreA < netScoreB
    ) {
      currentMatchResult += 1;
    } else if (
      typeof netScoreA === "number" &&
      typeof netScoreB === "number" &&
      netScoreA > netScoreB
    ) {
      currentMatchResult -= 1;
    }

    if (netScoreA === 0 && netScoreB === 0 && index === 0) {
      winByHoleResults.push("");
    } else if (currentMatchResult === 0) {
      winByHoleResults.push("AS");
    } else {
      const strokesUp = Math.abs(currentMatchResult);
      const remainingHolesToEndGame = 18 - (index + 1);

      if (strokesUp <= remainingHolesToEndGame || remainingHolesToEndGame < 0) {
        winByHoleResults.push(String(currentMatchResult));
      } else {
        if (18 - strokesUp >= index) {
          winByHoleResults.push(String(currentMatchResult));
        } else {
          // TODO: Add logic for draw
        }
      }
    }
  }

  const playerA_totalNet = playersList[0].score.totalNet;
  const playerB_totalNet = playersList[1].score.totalNet;

  if (playerA_totalNet === playerB_totalNet) {
    winnerMedalPlayIds = [
      playersList[0].score.idPlayer,
      playersList[1].score.idPlayer,
    ];
    strokePlayWinnerDescription = "Medal Play Draw";
  } else {
    winnerMedalPlayIds =
      playerA_totalNet < playerB_totalNet
        ? [playersList[0].score.idPlayer]
        : [playersList[1].score.idPlayer];
    strokePlayWinnerDescription =
      (playerA_totalNet < playerB_totalNet
        ? playersList[0].score.player
        : playersList[1].score.player) + " wins Medal Play";
  }

  if (currentMatchResult === 0) {
    matchPlayWinnerDescription = "Match All Square";
    winnerMatchIds = [
      playersList[0].score.idPlayer,
      playersList[1].score.idPlayer,
    ];
  } else {
    const leadingPlayer =
      currentMatchResult > 0 ? playersList[0].score : playersList[1].score;
    winnerMatchIds = [leadingPlayer.idPlayer];
    const holesUp = Math.abs(currentMatchResult);

    let matchConcludedEarly = false;
    const finalHolesUp = holesUp;
    const finalHolesRemaining = 0;

    for (let i = 0; i < winByHoleResults.length; i++) {
      const resultAtHole = winByHoleResults[i];
      if (resultAtHole && resultAtHole !== "AS" && resultAtHole !== "") {
        const lead = Math.abs(Number(resultAtHole));
        const holesPlayed = i + 1;
        const holesStillToPlay = 18 - holesPlayed;
        if (lead > holesStillToPlay) {
          matchPlayWinnerDescription = `${leadingPlayer.player} wins Match Play`;
          matchConcludedEarly = true;
          break;
        }
      }
    }
    if (!matchConcludedEarly) {
      matchPlayWinnerDescription = `${leadingPlayer.player} wins Match Play`;
    }
  }
  if (winByHoleResults.length === 0 && currentMatchResult === 0) {
    matchPlayWinnerDescription = "";
    winnerMatchIds = [""];
  }

  let finalWinnerString = "";
  if (isLTMEDAL || isLMEDAL) {
    finalWinnerString = strokePlayWinnerDescription;
  } else if (isLTMATCH || isLMATCH) {
    finalWinnerString = matchPlayWinnerDescription;
  } else {
    if (matchPlayWinnerDescription && strokePlayWinnerDescription) {
      finalWinnerString = `${matchPlayWinnerDescription} / ${strokePlayWinnerDescription}`;
    } else if (matchPlayWinnerDescription) {
      finalWinnerString = matchPlayWinnerDescription;
    } else if (strokePlayWinnerDescription) {
      finalWinnerString = strokePlayWinnerDescription;
    } else {
      finalWinnerString = "";
    }
  }

  return {
    calculatedWinnerMedalPlay: winnerMedalPlayIds,
    calculatedWinnerMatch: winnerMatchIds,
    calculatedWinByHole: winByHoleResults,
    calculatedMatchWinner: finalWinnerString,
  };
};

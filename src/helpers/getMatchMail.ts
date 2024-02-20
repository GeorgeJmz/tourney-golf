import ScoreViewModel from "../viewModels/ScoreViewModel";

export const getBodyMail = (
  players: Array<ScoreViewModel>,
  winByHole: Array<string>,
  hideTeam: boolean,
  winner: string
) => {
  const renderResultsMatch = (index: number) => {
    //Out
    if (index === 9) {
      return "";
    }
    //In, Gross, Net, HDCP, TEAM
    if (index >= 19) {
      return "";
    }
    const indexHole = index > 9 ? index - 1 : index;
    const win = winByHole[indexHole] || "";
    return index >= 19 ? "-" : win;
  };

  const renderResultsRows = () => {
    const lengthRows = hideTeam ? 23 : 24;
    return `<tr><td>MATCH</td> ${Array.from(
      { length: lengthRows },
      (_, index) =>
        `<td align="center"style="border: 1px solid;" >${renderResultsMatch(
          index
        )}</td>`
    ).join("")}</tr>`;
  };

  const headers = () => {
    const holes = [
      "HOLES",
      ...Array.from({ length: 9 }, (_, index) => index + 1),
      "OUT",
      ...Array.from({ length: 9 }, (_, index) => index + 10),
      "IN",
      "GROSS",
      "NET",
      "HDCP",
      "TEAM",
    ];
    if (hideTeam) {
      holes.pop();
    }
    return holes.reduce((acc, b) => `${acc}<th>${b}</th>`, "");
  };

  const renderScore = (index: number, rowIndex: number) => {
    const copyOfPlayers = [...players].reverse();
    const currentPlayer = copyOfPlayers[rowIndex];
    //Out
    if (index === 9) {
      return currentPlayer.score.out;
    }
    //In
    if (index === 19) {
      return currentPlayer.score.in;
    }
    //Gross
    if (index === 20) {
      return currentPlayer.score.totalGross;
    }
    //Net
    if (index === 21) {
      return currentPlayer.score.totalNet;
    }
    //HDCP
    if (index === 22) {
      return currentPlayer.score.handicap;
    }
    //TEAM
    if (index === 23) {
      return currentPlayer.score.teamPoints.reduce(
        (prev, curr) => prev + curr,
        0
      );
    }

    const indexHole = index > 9 ? index - 1 : index;

    const hasHandicap =
      currentPlayer.score.scoreHoles[indexHole] &&
      currentPlayer.score.scoreHolesHP[indexHole];
    const getScoreWithHP = hasHandicap
      ? `${currentPlayer.score.scoreHoles[indexHole]}/${
          currentPlayer.score.scoreHoles[indexHole] -
          currentPlayer.score.scoreHolesHP[indexHole]
        }`
      : currentPlayer.score.scoreHoles[indexHole];

    const upNumber = !hideTeam
      ? `<tr><td>${currentPlayer.score.teamPoints[indexHole] > 0 ? "+" : ""}${
          currentPlayer.score.teamPoints[indexHole] || "-"
        }</td></tr>`
      : "";
    const scor = `<table><tbody>${upNumber}<tr><td>${getScoreWithHP}</td></tr></tbody></table>`;

    return scor;
  };

  const renderPlayerRow = (player: string, rowIndex: number) => {
    const lengthRows = hideTeam ? 23 : 24;
    return `<tr style="border: 1px solid;"><td style="writing-mode: vertical-lr; transform: rotate(180deg);">${player}</td>${Array.from(
      { length: lengthRows },
      (_, index) =>
        `<td align="center" style="border: 1px solid;">${renderScore(
          index,
          rowIndex
        )}</td>`
    ).join("")}</tr>`;
  };

  const renderPlayerRows = () => {
    const copyOfPlayers = [...players].reverse();

    return copyOfPlayers.reduce(
      (acc, b, index) =>
        `${acc}<th>${renderPlayerRow(b.score.player, index)}</th>`,
      ""
    );
  };
  const header = `<thead ><tr> ${headers()}</tr></thead>`;
  const body = ` <tbody >${renderPlayerRows()}</tbody>`;
  const results = ` <tbody >${renderResultsRows()}</tbody>`;
  const winnerResult = ` <tfoot><tr><td  colspan='25'>${winner}</td></tr></tfoot>`;
  const table = `<table  style='table-layout: fixed; margin-bottom: 50px; border: 1px solid'>${header}${body}${results}${winnerResult}</table>`;
  return table;
};
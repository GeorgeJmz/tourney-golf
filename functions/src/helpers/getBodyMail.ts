import { Score } from "../types/Match";

export const getBodyMail = (
  players: Array<Score>,
  winByHole: Array<string>,
  hideTeam: boolean,
  winner: string,
  hideMatch: boolean,
  hideMedal: boolean,
  isDogfight?: boolean
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
      "HOLE",
      ...Array.from({ length: 9 }, (_, index) => index + 1),
      "OUT",
      ...Array.from({ length: 9 }, (_, index) => index + 10),
      "IN_",
      "TOT",
      "HCP",
      "NET",
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
      return currentPlayer.out;
    }
    //In
    if (index === 19) {
      return currentPlayer.in;
    }
    //Tot - Gross
    if (index === 20) {
      return currentPlayer.totalGross;
    }
    //HDCP
    if (index === 21) {
      return currentPlayer.handicap;
    }
    //Net
    if (index === 22) {
      return currentPlayer.totalNet;
    }
    //TEAM
    if (index === 23) {
      return currentPlayer.teamPoints.reduce((prev, curr) => prev + curr, 0);
    }

    const indexHole = index > 9 ? index - 1 : index;

    const hasHandicap =
      currentPlayer.scoreHoles[indexHole] &&
      currentPlayer.scoreHolesHP[indexHole];
    // const getScoreWithHP = hasHandicap
    //   ? `${currentPlayer.scoreHoles[indexHole]}/${
    //       currentPlayer.scoreHoles[indexHole] -
    //       currentPlayer.scoreHolesHP[indexHole]
    //     }`
    //   : currentPlayer.scoreHoles[indexHole];
    const getScoreWithHP = hasHandicap
      ? `<div style="position: relative;"><span style="position: absolute;top: -17px;left: -5px;font-size: 20px;color: green;"> • </span><span>${
          currentPlayer.scoreHoles[indexHole] || "-"
        }</span> </div>`
      : currentPlayer.scoreHoles[indexHole];
    const upNumber = !hideTeam
      ? `<tr><td>${currentPlayer.teamPoints[indexHole] > 0 ? "+" : ""}${
          currentPlayer.teamPoints[indexHole] || "-"
        }</td></tr>`
      : "";
    const scor = `<table><tbody>${upNumber}<tr><td>${getScoreWithHP}</td></tr></tbody></table>`;

    return scor;
  };

  const renderPlayerRow = (player: string, rowIndex: number) => {
    const lengthRows = hideTeam ? 23 : 24;
    const playerName = player.split(" ");
    return `<tr style="border: 1px solid;"><td style="writing-mode: vertical-lr; text-orientation: mixed; ">${
      playerName[0] !== "undefined" && playerName[0] !== ""
        ? playerName[0]
        : playerName[1] || playerName
    }</td>${Array.from(
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
      (acc, b, index) => `${acc}<th>${renderPlayerRow(b.player, index)}</th>`,
      ""
    );
  };
  const header = `<thead ><tr> ${headers()}</tr></thead>`;
  const body = ` <tbody >${renderPlayerRows()}</tbody>`;
  const results = isDogfight ? "" : ` <tbody >${renderResultsRows()}</tbody>`;
  const realWinner = winner.split("/");
  const finalWinner =
    !hideMatch && !hideMedal
      ? winner
      : hideMatch && !hideMedal
      ? realWinner[1]
      : realWinner[0];

  const winnerResult = finalWinner
    ? ` <tfoot><tr><td  colspan='25' style="font-size:28px">${finalWinner}</td></tr></tfoot>`
    : "";
  const table = `<table  style='margin-bottom: 50px; border: 1px solid'>${header}${body}${results}${winnerResult}</table>`;
  return table;
};

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableFooter,
  TableRow,
  Paper,
} from "@mui/material";
import MatchViewModel from "../../../viewModels/MatchViewModel";

interface HorizontalScoreCardProps {
  match: MatchViewModel;
  hideMatch?: boolean;
  hideTeam?: boolean;
}

const HorizontalScoreCard: React.FC<HorizontalScoreCardProps> = ({
  match,
  hideMatch,
  hideTeam,
}) => {
  const stylesByIndex = (index: number, isHeader = false) => {
    if (index === 0) {
      return {
        filter: "drop-shadow(7px 7px 11px grey)",
        position: "sticky",
        left: 0,
        backgroundColor: "rgb(118, 118, 118);",
        color: "white",
        fontWeight: "bold",
        border: "none",
        width: 80,
      };
    }
    if (index === 10 || index === 20) {
      return {
        border: 0,
        width: 80,
        backgroundColor: "rgb(118, 118, 118);",
        color: "white",
        fontWeight: "bold",
      };
    }
    if (index > 20 && isHeader) {
      return {
        border: 0,
        width: 80,
        backgroundColor: "Green",
        color: "white",
        fontWeight: "bold",
      };
    }
    return { border: 1, color: "rgb(118, 118, 118);", width: 80 };
  };

  const renderHoleHeaders = () => {
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
    return (
      <TableRow>
        {holes.map((hole, index) => (
          <TableCell key={index} align="center" sx={stylesByIndex(index, true)}>
            {hole}
          </TableCell>
        ))}
      </TableRow>
    );
  };

  const renderScore = (index: number, rowIndex: number) => {
    const copyOfPlayers = [...match.players].reverse();
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
    const scoreComponent = (
      <div style={{ position: "relative" }}>
        <span>{getScoreWithHP || "-"}</span>{" "}
        {!hideTeam && (
          <span
            style={{
              position: "absolute",
              top: -15,
              right: -10,
              color: "Green",
            }}
          >
            {`${currentPlayer.score.teamPoints[indexHole] > 0 ? "+" : ""}${
              currentPlayer.score.teamPoints[indexHole] || "-"
            }`}
          </span>
        )}
      </div>
    );
    return scoreComponent;
  };

  const renderPlayerRow = (player: string, rowIndex: number) => {
    const lengthRows = hideTeam ? 23 : 24;
    return (
      <TableRow key={rowIndex}>
        <TableCell
          sx={{
            filter: "drop-shadow(7px 7px 11px grey)",
            position: "sticky",
            left: 0,
            background: "#fff",
            zIndex: 2,
            border: "none",
            color: "rgb(118, 118, 118);",
            width: 80,
          }}
        >
          {player}
        </TableCell>
        {Array.from({ length: lengthRows }, (_, index) => (
          <TableCell key={index} align="center" sx={stylesByIndex(index + 1)}>
            {renderScore(index, rowIndex)}
          </TableCell>
        ))}
      </TableRow>
    );
  };

  const renderPlayerRows = () => {
    const copyOfPlayers = [...match.players].reverse();
    return copyOfPlayers.map((player, index) =>
      renderPlayerRow(player.score.player, index)
    );
  };

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
    const winner = match.winByHole[indexHole];
    return index >= 19 ? "-" : winner;
  };

  const renderResultsRows = () => {
    return (
      <TableRow>
        <TableCell
          sx={{
            filter: "drop-shadow(7px 7px 11px grey)",
            position: "sticky",
            left: 0,
            background: "#fff",
            zIndex: 2,
            border: "none",
            color: "rgb(118, 118, 118);",
            width: 80,
          }}
        >
          MATCH
        </TableCell>
        {Array.from({ length: 24 }, (_, index) => (
          <TableCell key={index} align="center" sx={stylesByIndex(index + 1)}>
            {renderResultsMatch(index)}
          </TableCell>
        ))}
      </TableRow>
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table style={{ tableLayout: "fixed", marginBottom: "50px" }}>
        <TableHead>{renderHoleHeaders()}</TableHead>
        <TableBody>{renderPlayerRows()}</TableBody>
        {!hideMatch && <TableBody>{renderResultsRows()}</TableBody>}
        {match.match.winner !== "" && (
          <TableFooter>
            <TableRow>
              <TableCell
                colSpan={25}
                align="right"
                sx={{ border: 1, color: "rgb(118, 118, 118);", width: 80 }}
              >
                {match.match.winner}
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </TableContainer>
  );
};

export default HorizontalScoreCard;

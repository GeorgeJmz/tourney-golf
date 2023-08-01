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
}

const HorizontalScoreCard: React.FC<HorizontalScoreCardProps> = ({ match }) => {
  const renderHoleHeaders = () => {
    const holes = [
      "HOLES",
      ...Array.from({ length: 18 }, (_, index) => index + 1),
      "GROSS",
      "NET",
      "HDCP",
      "TEAM",
    ];
    return (
      <TableRow>
        {holes.map((hole, index) => (
          <TableCell
            key={index}
            align="center"
            sx={{ border: 0.5, color: "ActiveBorder", width: 80 }}
          >
            {hole}
          </TableCell>
        ))}
      </TableRow>
    );
  };

  const renderScore = (index: number, rowIndex: number) => {
    const currentPlayer = match.players[rowIndex];
    //Gross
    if (index === 18) {
      return currentPlayer.score.total;
    }
    //Net
    if (index === 19) {
      return currentPlayer.score.totalNet;
    }
    //HDCP
    if (index === 20) {
      return currentPlayer.score.strokes;
    }
    //TEAM
    if (index === 21) {
      return "-";
    }

    const hasHandicap =
      currentPlayer.score.scoreHoles[index] &&
      currentPlayer.score.scoreHolesHP[index];
    const getScoreWithHP = hasHandicap
      ? `${currentPlayer.score.scoreHoles[index]}/${
          currentPlayer.score.scoreHoles[index] - 1
        }`
      : currentPlayer.score.scoreHoles[index];
    const scoreComponent = (
      <div style={{ position: "relative" }}>
        <span>{getScoreWithHP || "-"}</span>{" "}
        <span
          style={{
            position: "absolute",
            top: -15,
            right: -10,
            color: "InfoText",
          }}
        >
          {hasHandicap ? "1" : ""}
        </span>
      </div>
    );
    return scoreComponent;
  };

  const renderPlayerRow = (player: string, rowIndex: number) => {
    return (
      <TableRow key={rowIndex}>
        <TableCell sx={{ border: 0.5, color: "ActiveBorder", width: 80 }}>
          {player}
        </TableCell>
        {Array.from({ length: 22 }, (_, index) => (
          <TableCell
            key={index}
            align="center"
            sx={{ border: 0.5, color: "ActiveBorder", width: 80 }}
          >
            {renderScore(index, rowIndex)}
          </TableCell>
        ))}
      </TableRow>
    );
  };

  const renderPlayerRows = () => {
    return match.players.map((player, index) =>
      renderPlayerRow(player.score.player, index)
    );
  };

  const renderResultsRows = () => {
    return (
      <TableRow>
        <TableCell sx={{ border: 0.5, color: "ActiveBorder", width: 80 }}>
          MATCH
        </TableCell>
        {match.winByHole.map((winner, index) => (
          <TableCell
            key={index}
            align="center"
            sx={{ border: 0.5, color: "ActiveBorder", width: 80 }}
          >
            {index >= 18 ? "-" : winner}
          </TableCell>
        ))}
      </TableRow>
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table style={{ tableLayout: "fixed" }}>
        <TableHead>{renderHoleHeaders()}</TableHead>
        <TableBody>{renderPlayerRows()}</TableBody>
        <TableBody>{renderResultsRows()}</TableBody>
        {match.match.winner !== "" && <TableFooter>
          {" "}
          <TableRow>
            <TableCell
              colSpan={23}
              align="center"
              sx={{ border: 0.5, color: "ActiveBorder", width: 80 }}
            >
              {match.match.winner}
            </TableCell>
          </TableRow>
        </TableFooter>}
      </Table>
    </TableContainer>
  );
};

export default HorizontalScoreCard;

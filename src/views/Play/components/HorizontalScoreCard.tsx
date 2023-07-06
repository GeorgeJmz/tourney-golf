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
import ScoreViewModel from "../../../viewModels/ScoreViewModel";

interface HorizontalScoreCardProps {
  players: Array<ScoreViewModel>;
}

const HorizontalScoreCard: React.FC<HorizontalScoreCardProps> = ({
  players,
}) => {
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
          <TableCell key={index} align="center">
            {hole}
          </TableCell>
        ))}
      </TableRow>
    );
  };

  const renderPlayerRow = (player: string, rowIndex: number) => {
    return (
      <TableRow key={rowIndex}>
        <TableCell>{player}</TableCell>
        {Array.from({ length: 22 }, (_, index) => (
          <TableCell key={index} align="center">
            {index === 18
              ? players[rowIndex].score.total
              : players[rowIndex].score.scoreHoles[index] || "-"}
          </TableCell>
        ))}
      </TableRow>
    );
  };

  const renderPlayerRows = () => {
    return players.map((player, index) =>
      renderPlayerRow(player.score.player, index)
    );
  };

  const renderResultsRows = () => {
    const winners = Array(18)
      .fill(0)
      .map((_, index) => {
        const holeScores = players.map(
          (player) => player.score.scoreHoles[index]
        );
        const minScore = Math.min(...holeScores);
        const winners = players.filter(
          (player) => player.score.scoreHoles[index] === minScore
        );
        return winners.length === 1 ? winners : minScore !== 0 ? winners : [];
      });

    return (
      <TableRow>
        <TableCell>LG</TableCell>
        {Array.from({ length: 22 }, (_, index) => (
          <TableCell key={index} align="center">
            {index >= 18
              ? "-"
              : winners[index].map((player) => player.score.player).join(", ")}
          </TableCell>
        ))}
      </TableRow>
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>{renderHoleHeaders()}</TableHead>
        <TableBody>{renderPlayerRows()}</TableBody>
        <TableBody>{renderResultsRows()}</TableBody>
        <TableFooter>
          {" "}
          <TableRow>
            <TableCell colSpan={23} align="center">
              Player Wons the match{" "}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default HorizontalScoreCard;

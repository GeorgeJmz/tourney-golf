import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import type { IMatch } from "../models/Match";
import MenuItems from "./MenuItems";

interface RoundReviewDogfightProps {
  leagueResults: IMatch[];
  playersResultsOptions: {
    label: string;
    value: string;
  }[];
  onDeleteRound: (idRound: string, idPlayer: string) => void;
}

const RoundReviewDogfight: React.FC<RoundReviewDogfightProps> = ({
  leagueResults,
  onDeleteRound,
  playersResultsOptions,
}) => {
  const [playerSelected, setPlayerSelected] = React.useState("");
  const [roundSelected, setRoundSelected] = React.useState("");
  const headerStyles = {
    border: 0,
    textAlign: "center",
    backgroundColor: "Green",
    color: "white",
    fontWeight: "bold",
  };

  const roundOptions = [
    { label: "All Rounds", value: "" },
    ...leagueResults
      .reduce((acc, match) => {
        if (match.round !== undefined && !acc.includes(match.round)) {
          acc.push(match.round);
        }
        return acc;
      }, [] as number[])
      .map((round) => ({
        label: round === 0 ? "Championship" : `Round ${round}`,
        value: round.toString(),
      })),
  ];
  const playerOptions = [
    { label: "All Players", value: "" },
    ...playersResultsOptions,
  ];
  const filteredResults = leagueResults.filter(
    (match) => match?.round === Number(roundSelected) || roundSelected === ""
  );
  const onChangeRound = (e: string) => {
    setRoundSelected(e);
  };

  const onChangePlayer = (e: string) => {
    setPlayerSelected(e);
  };

  return (
    <Box alignContent="center">
      <TableContainer component={Box}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={headerStyles}>
                <MenuItems
                  noFirstOption
                  options={roundOptions.map((option) => ({
                    label: option.label,
                    value: option.value ?? "",
                  }))}
                  placeholder="All Rounds"
                  onChange={onChangeRound}
                  isActive={true}
                />
              </TableCell>
              <TableCell sx={headerStyles}>
                <MenuItems
                  noFirstOption
                  options={playerOptions}
                  placeholder="All Players"
                  onChange={onChangePlayer}
                  isActive={true}
                />
              </TableCell>
              <TableCell sx={headerStyles}>Gross</TableCell>
              <TableCell sx={headerStyles}>HDCP</TableCell>
              <TableCell sx={headerStyles}>Net</TableCell>
              <TableCell sx={headerStyles}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredResults.map((match) => {
              return match.matchResults.map((player) => {
                return player.idPlayer === playerSelected ||
                  playerSelected === "" ? (
                  <TableRow key={`${match.id}-${player.idPlayer}`}>
                    <TableCell sx={{ textAlign: "center", minWidth: "80px" }}>
                      <TextField
                        size="small"
                        type="hidden"
                        name="id"
                        sx={{ display: "none" }}
                        defaultValue={`${match.id}-${player.idPlayer}`}
                      />{" "}
                      {match.round === 0
                        ? "Championship"
                        : `Round ${match.round}`}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", minWidth: "80px" }}>
                      {player.playerName}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", minWidth: "80px" }}>
                      <p style={{ margin: 0 }}>{player.gross}</p>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", minWidth: "80px" }}>
                      <p style={{ margin: 0 }}>{player.hcp}</p>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", minWidth: "80px" }}>
                      <p style={{ margin: 0 }}>{player.score}</p>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", minWidth: "80px" }}>
                      <IconButton
                        aria-label="delete"
                        onClick={() =>
                          onDeleteRound(match.id || "", player.idPlayer || "")
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ) : null;
              });
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RoundReviewDogfight;

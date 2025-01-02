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
import type { IMatch, IMatchResults } from "../models/Match";
import MenuItems from "./MenuItems";
import { convertMomentDate, differenceDate } from "../helpers/convertDate";
import { toJS } from "mobx";
import { DateInput } from "./DateInput";
import dayjs from "dayjs";
import { on } from "events";

interface RoundReviewTeamPlayProps {
  leagueResults: IMatch[];
  onChangeDate: (idRound: string, newDate: string) => void;
  onRemovePlayer: (idRound: string, idPlayer: string) => void;
}

const RoundReviewTeamPlay: React.FC<RoundReviewTeamPlayProps> = ({
  leagueResults,
  onChangeDate,
  onRemovePlayer,
}) => {
  const headerStyles = {
    border: 0,
    textAlign: "center",
    backgroundColor: "Green",
    color: "white",
    fontWeight: "bold",
  };

  const getPropComponent = (prop: keyof IMatchResults, match: IMatch) => {
    return match.matchResults.map((result) => (
      <>
        <p>{result[prop]}</p>
      </>
    ));
  };

  return (
    <Box alignContent="center">
      <TableContainer component={Box}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={headerStyles}>Date</TableCell>
              <TableCell sx={headerStyles}>Menu Items</TableCell>
              <TableCell sx={headerStyles}>Team Points</TableCell>
              <TableCell sx={headerStyles}>Gross</TableCell>
              <TableCell sx={headerStyles}>HDCP</TableCell>
              <TableCell sx={headerStyles}>Net</TableCell>
              <TableCell sx={headerStyles}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leagueResults.map((match) => (
              <TableRow key={match.id}>
                <TableCell sx={{ textAlign: "center", minWidth: "80px" }}>
                  <DateInput
                    inputElement={{
                      name: "date",
                      input: "date",
                      placeholder: "Date",
                      size: { xs: 12, md: 12, lg: 12 },
                    }}
                    error=""
                    isError={false}
                    onChange={(newDate) => {
                      const date = dayjs(newDate).format();
                      console.log(date);
                      onChangeDate(match.id || "", date);
                    }}
                    value={convertMomentDate(match.date)}
                  />
                </TableCell>
                <TableCell sx={{ textAlign: "center", minWidth: "80px" }}>
                  {getPropComponent("playerName", match)}
                </TableCell>

                <TableCell sx={{ textAlign: "center", minWidth: "80px" }}>
                  {getPropComponent("teamPoints", match)}
                </TableCell>
                <TableCell sx={{ textAlign: "center", minWidth: "80px" }}>
                  {getPropComponent("gross", match)}
                </TableCell>
                <TableCell sx={{ textAlign: "center", minWidth: "80px" }}>
                  {getPropComponent("hcp", match)}
                </TableCell>
                <TableCell sx={{ textAlign: "center", minWidth: "80px" }}>
                  {getPropComponent("score", match)}
                </TableCell>
                <TableCell sx={{ textAlign: "center", minWidth: "80px" }}>
                  {match.matchResults.map((result) => (
                    <p
                      style={{
                        margin: 0,
                        padding: 0,
                      }}
                    >
                      <IconButton
                        size="small"
                        aria-label="delete"
                        onClick={() =>
                          onRemovePlayer(match.id || "", result.idPlayer)
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </p>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RoundReviewTeamPlay;

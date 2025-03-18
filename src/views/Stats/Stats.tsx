import React, { useState, useMemo, useEffect, useCallback } from "react";
import { observer } from "mobx-react";
import UserViewModel from "../../viewModels/UserViewModel";
import TournamentViewModel from "../../viewModels/TournamentViewModel";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { toJS } from "mobx";

interface IStatsProps {
  user: UserViewModel;
}

const Stats: React.FC<IStatsProps> = ({ user }) => {
  const { id } = useParams();
  const userId = useMemo(() => user.getUserId(), [user]);
  const [stats, setStats] = useState("");
  const tournamentViewModel = useMemo(() => new TournamentViewModel(), []);

  useEffect(() => {
    if (id) {
      const currentTournament =
        user.activeTournaments.find((t) => t.id === id) ||
        user.historyTournaments.find((t) => t.id === id);

      if (currentTournament && tournamentViewModel.author === "") {
        tournamentViewModel.setTournament(currentTournament);
        tournamentViewModel.setTournamentId(id);
        tournamentViewModel.setAuthor(userId);
      }

      tournamentViewModel.setTournamentId(id);
      tournamentViewModel.getNewStats();
      setStats(tournamentViewModel.tournament.conferencesList[0].id || "");
    }
  }, [id, user, tournamentViewModel, userId]);

  const preprocessedStats = useMemo(() => {
    const rawStats = toJS(tournamentViewModel.newStats[stats]) || [];
    console.log(rawStats, "rawStats");
    const sortedRawStats = Object.values(rawStats).sort((a, b) =>
      a[0].player.localeCompare(b[0].player)
    );
    console.log(sortedRawStats, "sortedRawStats");
    return sortedRawStats.map((items) =>
      items
        .slice()
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
  }, [tournamentViewModel.newStats, stats]);

  const handleStatsChange = useCallback((newStatsValue: string) => {
    setStats(newStatsValue);
  }, []);

  const formatDateWithoutYear = useCallback((dateString: string) => {
    const [day, month] = dateString.split("/");
    return `${day}/${month}`;
  }, []);

  const tableCellStyles = useMemo(
    () => ({
      minWidth: "80px",
      maxWidth: "120px",
      padding: "8px",
      textAlign: "center",
      borderBottom: "1px solid rgba(224, 224, 224, 1)",
    }),
    []
  );

  const hStyles = useMemo(
    () => ({
      ...tableCellStyles,
      filter: "drop-shadow(7px 7px 11px grey)",
      position: "sticky",
      top: 0,
      backgroundColor: "rgb(118, 118, 118);",
      color: "white",
      fontWeight: "bold",
      border: "none",
      zIndex: 1,
    }),
    [tableCellStyles]
  );

  return (
    <Box sx={{ background: "white", p: 3 }}>
      <Box>
        {tournamentViewModel.tournament.conferencesList.map((c) => (
          <Button
            key={c.id}
            variant={stats === c.id ? "contained" : "outlined"}
            color={stats === c.id ? "primary" : "inherit"}
            onClick={() => handleStatsChange(c.id)}
          >
            {c.name}
          </Button>
        ))}
      </Box>
      {preprocessedStats.map((ppStat, index) => (
        <TableContainer
          key={ppStat[0].player}
          component={Box}
          sx={{ overflowX: "auto", mt: 2, mb: 2 }}
        >
          <Table sx={{ tableLayout: "fixed" }}>
            {" "}
            {/* Asegurar que la tabla tenga un layout fijo */}
            <TableHead>
              <TableRow>
                {ppStat.length > 0 && (
                  <TableCell sx={hStyles}>{ppStat[0].player}</TableCell>
                )}
                {ppStat.map((data, i) => (
                  <TableCell
                    key={`${index}-${i}-${data.date}-${ppStat[0].player}`}
                    sx={hStyles}
                  >
                    {formatDateWithoutYear(data.date)}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                {ppStat.length > 0 && (
                  <TableCell sx={tableCellStyles}>HDCP</TableCell>
                )}
                {ppStat.map((data, i) => (
                  <TableCell
                    key={`${index}-${data.date}-${i}-${ppStat[0].player}-hdc-${data.hdc}`}
                    sx={tableCellStyles}
                  >
                    {data.hdc}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                {ppStat.length > 0 && (
                  <TableCell sx={tableCellStyles}>Net vs Par</TableCell>
                )}
                {ppStat.map((data, i) => (
                  <TableCell
                    key={`${index}-${data.date}-${i}-${ppStat[0].player}-net-${data.net}`}
                    sx={tableCellStyles}
                  >
                    {data.net}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                {ppStat.length > 0 && (
                  <TableCell sx={tableCellStyles}>Points</TableCell>
                )}
                {ppStat.map((data, i) => (
                  <TableCell
                    key={`${index}-${data.date}-${i}-${ppStat[0].player}-points-${data.points}`}
                    sx={tableCellStyles}
                  >
                    {data.points}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                {ppStat.length > 0 && (
                  <TableCell sx={tableCellStyles}>Opponent</TableCell>
                )}
                {ppStat.map((data, i) => (
                  <TableCell
                    key={`${index}-${data.date}-${i}-${ppStat[0].player}-opponent-${data.opponent}`}
                    sx={tableCellStyles}
                  >
                    {data.opponent}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ))}
    </Box>
  );
};

export default observer(Stats);

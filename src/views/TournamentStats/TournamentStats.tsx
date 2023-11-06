import * as React from "react";
import { observer } from "mobx-react";
import UserViewModel from "../../viewModels/UserViewModel";
import TournamentViewModel from "../../viewModels/TournamentViewModel";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useParams } from "react-router-dom";
import type { ITournamentPlayer } from "../../models/Player";
import { getPlayersByTournamentId } from "../../services/firebase";
import { set } from "firebase/database";

interface ITournamentStatsProps {
  user: UserViewModel;
}

const TournamentStats: React.FC<ITournamentStatsProps> = ({ user }) => {
  const userId = React.useMemo(() => user.getUserId(), []);
  const tournamentViewModel = React.useMemo(
    () => new TournamentViewModel(),
    []
  );
  const { id } = useParams();
  const [players, setPlayers] = React.useState([
    {
      id: 1,
      position: 1,
      tourneyName: "Torneo 1",
      matchesPlayed: 3,
      wins: 2,
      draws: 0,
      losses: 1,
      matchPoints: 6,
      medalPoints: 0,
      totalPoints: 6,
      grossAverage: 6,
      handicapAverage: 6,
      netAverage: 6,
      teamPoints: 0,
    },
  ]);

  const currentTournament = React.useMemo(
    () => user.activeTournaments.find((t) => t.id === id),
    []
  );

  if (currentTournament && id && tournamentViewModel.author === "") {
    tournamentViewModel.setTournament(currentTournament);
    tournamentViewModel.setTournamentId(id);
    tournamentViewModel.setAuthor(userId);
  }

  React.useEffect(() => {
    if (id) {
      getPlayersByTournamentId(id).then((allPlayers) => {
        console.log(allPlayers);
        if (allPlayers) {
          const newPlayers = allPlayers.map((p) => ({
            id: Number(p.id), // Change id to a number
            position: 0, // Add position property
            tourneyName: p.name, // Add tourneyName property
            matchesPlayed: p.opponent.length * 2,
            wins:
              p.pointsMatch.reduce(
                (acc, curr) => (curr === 3 ? acc + 1 : acc),
                0
              ) +
              p.pointsStroke.reduce(
                (acc, curr) => (curr === 3 ? acc + 1 : acc),
                0
              ),
            draws:
              p.pointsMatch.reduce(
                (acc, curr) => (curr === 1 ? acc + 1 : acc),
                0
              ) +
              p.pointsStroke.reduce(
                (acc, curr) => (curr === 1 ? acc + 1 : acc),
                0
              ),
            losses:
              p.pointsMatch.reduce(
                (acc, curr) => (curr === 0 ? acc + 1 : acc),
                0
              ) +
              p.pointsStroke.reduce(
                (acc, curr) => (curr === 0 ? acc + 1 : acc),
                0
              ),
            matchPoints: p.pointsMatch.reduce((acc, curr) => acc + curr, 0),
            medalPoints: p.pointsStroke.reduce((acc, curr) => acc + curr, 0),
            totalPoints:
              p.pointsMatch.reduce((acc, curr) => acc + curr, 0) +
              p.pointsStroke.reduce((acc, curr) => acc + curr, 0),
            grossAverage: 0,
            handicapAverage: 0,
            netAverage: 0,
            teamPoints: p.pointsTeam.reduce((acc, curr) => acc + curr, 0),
          }));
          console.log(newPlayers);
          setPlayers(newPlayers.sort((a, b) => b.totalPoints - a.totalPoints));
        }
      });
    }
  }, [id]);

  const tableRows = players.map((t, i) => (
    <TableRow key={t.id}>
      <TableCell>{i + 1}</TableCell>
      <TableCell>{t.tourneyName}</TableCell>
      <TableCell>{t.matchesPlayed}</TableCell>
      <TableCell>{t.wins}</TableCell>
      <TableCell>{t.draws}</TableCell>
      <TableCell>{t.losses}</TableCell>
      <TableCell>{t.matchPoints}</TableCell>
      <TableCell>{t.medalPoints}</TableCell>
      <TableCell>{t.totalPoints}</TableCell>
      <TableCell>{t.grossAverage || "-"}</TableCell>
      <TableCell>{t.handicapAverage || "-"}</TableCell>
      <TableCell>{t.netAverage || "-"}</TableCell>
      <TableCell>{t.teamPoints || "-"}</TableCell>
    </TableRow>
  ));

  return (
    <Box sx={{ background: "white", p: 3 }}>
      <Typography gutterBottom align="left" variant="h6" component="div">
        <EmojiEventsIcon /> {currentTournament?.name}
      </Typography>
      <TableContainer component={Box}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell> </TableCell>
              <TableCell> </TableCell>
              <TableCell>Matches Played</TableCell>
              <TableCell>Wins</TableCell>
              <TableCell>Draws</TableCell>
              <TableCell>Losses</TableCell>
              <TableCell>Match Points</TableCell>
              <TableCell>Medal Points</TableCell>
              <TableCell>Total Points</TableCell>
              <TableCell>Gross Average</TableCell>
              <TableCell>Handicap Average</TableCell>
              <TableCell>Net Average</TableCell>
              <TableCell>Team Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{tableRows}</TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default observer(TournamentStats);

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
      tournamentViewModel.getStatsPlayersByTournament();
    }
  }, [id]);

  const tableRows = tournamentViewModel.statsPlayers.map((t, i) => (
    <TableRow key={t.id} >
      <TableCell sx={{textAlign: "center"}}>{i + 1}</TableCell>
      <TableCell sx={{textAlign: "center"}}>{t.tourneyName}</TableCell>
      <TableCell sx={{textAlign: "center"}}>{t.matchesPlayed}</TableCell>
      <TableCell sx={{textAlign: "center"}}>{t.wins}</TableCell>
      <TableCell sx={{textAlign: "center"}}>{t.draws}</TableCell>
      <TableCell sx={{textAlign: "center"}}>{t.losses}</TableCell>
      <TableCell sx={{textAlign: "center"}}>{t.matchPoints}</TableCell>
      <TableCell sx={{textAlign: "center"}}>{t.medalPoints}</TableCell>
      <TableCell sx={{textAlign: "center"}}>{t.totalPoints}</TableCell>
      <TableCell sx={{textAlign: "center"}}>{t.grossAverage || "-"}</TableCell>
      <TableCell sx={{textAlign: "center"}}>{t.handicapAverage || "-"}</TableCell>
      <TableCell sx={{textAlign: "center"}}>{t.netAverage || "-"}</TableCell>
      <TableCell sx={{textAlign: "center"}}>{t.teamPoints || "-"}</TableCell>
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
              <TableCell>Games Played</TableCell>
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

import * as React from "react";
import { observer } from "mobx-react";
import UserViewModel from "../../viewModels/UserViewModel";
import TournamentViewModel from "../../viewModels/TournamentViewModel";
import {
  Box,
  Button,
  ButtonGroup,
  Menu,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useParams } from "react-router-dom";
import MenuItems from "../../components/MenuItems";

interface ITournamentStatsProps {
  user: UserViewModel;
}

const TournamentStats: React.FC<ITournamentStatsProps> = ({ user }) => {
  const userId = React.useMemo(() => user.getUserId(), []);
  const [stats, setStats] = React.useState("players");

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

  const tableRows = () => {
    const p =
      stats === "players"
        ? tournamentViewModel.statsPlayers
        : tournamentViewModel.statsPlayers.filter(
            (p) => p.conference === stats || p.group === stats
          );
    const rows = p.map((t, i) => (
      <TableRow key={t.id}>
        <TableCell sx={{ textAlign: "center" }}>{i + 1}</TableCell>
        <TableCell sx={{ textAlign: "center" }}>{t.tourneyName}</TableCell>
        <TableCell sx={{ textAlign: "center" }}>{t.matchesPlayed}</TableCell>
        <TableCell sx={{ textAlign: "center" }}>{t.wins}</TableCell>
        <TableCell sx={{ textAlign: "center" }}>{t.draws}</TableCell>
        <TableCell sx={{ textAlign: "center" }}>{t.losses}</TableCell>
        <TableCell sx={{ textAlign: "center" }}>{t.matchPoints}</TableCell>
        <TableCell sx={{ textAlign: "center" }}>{t.medalPoints}</TableCell>
        <TableCell sx={{ textAlign: "center" }}>{t.totalPoints}</TableCell>
        <TableCell sx={{ textAlign: "center" }}>
          {t.grossAverage || "-"}
        </TableCell>
        <TableCell sx={{ textAlign: "center" }}>
          {t.handicapAverage || "-"}
        </TableCell>
        <TableCell sx={{ textAlign: "center" }}>
          {t.netAverage || "-"}
        </TableCell>
        <TableCell sx={{ textAlign: "center" }}>
          {t.teamPoints || "-"}
        </TableCell>
      </TableRow>
    ));
    return rows;
  };

  const tableRowsTeams = tournamentViewModel.statsTeams.map((t, i) => (
    <TableRow key={t.name}>
      <TableCell sx={{ textAlign: "center" }}>{i + 1}</TableCell>
      <TableCell sx={{ textAlign: "center" }}>{t.name}</TableCell>
      <TableCell sx={{ textAlign: "center" }}>{t.playersNames}</TableCell>
      <TableCell sx={{ textAlign: "center" }}>{t.roundsPlayed}</TableCell>
      <TableCell sx={{ textAlign: "center" }}>{t.points}</TableCell>
    </TableRow>
  ));

  return (
    <Box sx={{ background: "white", p: 3, height: "100vh" }}>
      <div>
        <Box
          sx={{
            background: "white",
            p: 3,
            gap: 2,
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant={stats === "players" ? "contained" : "outlined"}
            onClick={() => setStats("players")}
          >
            Leaderboard
          </Button>
          <MenuItems
            options={tournamentViewModel.conferencesOptions}
            placeholder="Conferences"
            onChange={setStats}
            isActive={tournamentViewModel.conferencesOptions.some(
              (g) => g.value === stats
            )}
          />
          <MenuItems
            options={tournamentViewModel.groupsOptions}
            placeholder="Groups"
            onChange={setStats}
            isActive={tournamentViewModel.groupsOptions.some(
              (g) => g.value === stats
            )}
          />
          <Button
            variant={stats === "teams" ? "contained" : "outlined"}
            key="teams"
            onClick={() => setStats("teams")}
          >
            Teams
          </Button>
        </Box>
      </div>
      {stats !== "teams" && (
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
            <TableBody>{tableRows()}</TableBody>
          </Table>
        </TableContainer>
      )}
      {stats === "teams" && (
        <TableContainer component={Box}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell> </TableCell>
                <TableCell sx={{ textAlign: "center" }}> Team </TableCell>
                <TableCell sx={{ textAlign: "center" }}> Players </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {" "}
                  Rounds Played{" "}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {" "}
                  Total Points{" "}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{tableRowsTeams}</TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default observer(TournamentStats);

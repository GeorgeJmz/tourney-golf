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
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useParams } from "react-router-dom";
import MenuItems from "../../components/MenuItems";
import { toJS } from "mobx";
import { ro } from "@faker-js/faker";

interface ITournamentDogfightStatsProps {
  user: UserViewModel;
}

const TournamentDogfightStats: React.FC<ITournamentDogfightStatsProps> = ({
  user,
}) => {
  const userId = React.useMemo(() => user.getUserId(), []);
  const [stats, setStats] = React.useState("players");

  enum Board {
    Round = "round",
    Qualy = "qualy",
    Champ = "champ",
  }

  const [board, setBoard] = React.useState(Board.Round);

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
      tournamentViewModel.setTournamentId(id);
    }
  }, [id]);

  const numberOfRounds = tournamentViewModel.tournament.numberOfRounds;
  const [round, setRound] = React.useState(1);
  const roundsForQualy = tournamentViewModel.tournament.minRounds;

  console.log("roundsForQualy", roundsForQualy);

  React.useEffect(() => {
    if (id) {
      if (board === Board.Round) {
        tournamentViewModel.getPlayersPerRound(round);
      }
      if (board === Board.Qualy) {
        tournamentViewModel.getPlayersOfChampionshipRound();
      }
      if (board === Board.Champ) {
        tournamentViewModel.getPlayersPerRound(0);
      }
    }
  }, [round, board]);

  const tableRows = () => {
    const p = tournamentViewModel.dogfightStats;
    const namesStyles = {
      textAlign: "center",
      filter: "drop-shadow(7px 7px 11px grey)",
      position: "sticky",
      left: 0,
      backgroundColor: "rgb(118, 118, 118);",
      color: "white",
      fontWeight: "bold",
      border: "none",
      width: 80,
      zIndex: 1,
    };

    const rows = p.map((t, i) => (
      <TableRow key={`${id}`}>
        <TableCell sx={namesStyles}>{i + 1}</TableCell>
        <TableCell sx={namesStyles}>{t.name}</TableCell>
        <TableCell sx={{ textAlign: "center" }}>{t.net || "-"}</TableCell>
        <TableCell sx={{ textAlign: "center" }}>{t.handicap}</TableCell>
        <TableCell sx={{ textAlign: "center" }}>{t.gross || "-"}</TableCell>
      </TableRow>
    ));

    return rows;
  };

  const hStyles = {
    textAlign: "center",
    filter: "drop-shadow(7px 7px 11px grey)",
    position: "sticky",
    top: 0,
    backgroundColor: "rgb(118, 118, 118);",
    color: "white",
    fontWeight: "bold",
    border: "none",
    width: 80,
    zIndex: 1,
  };

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
            variant={board === Board.Round ? "contained" : "outlined"}
            onClick={() => setBoard(Board.Round)}
          >
            Round
          </Button>
          <Button
            variant={board === "qualy" ? "contained" : "outlined"}
            onClick={() => setBoard(Board.Qualy)}
          >
            Qualy
          </Button>
          <Button
            variant={board === "champ" ? "contained" : "outlined"}
            onClick={() => setBoard(Board.Champ)}
          >
            Champ
          </Button>
        </Box>
        {board === Board.Round && (
          <Box>
            <Button
              disabled={round === 1}
              onClick={() => {
                if (round > 1) {
                  setRound(round - 1);
                }
              }}
            >
              <ArrowBackIosNewIcon />
            </Button>
            {round}
            <Button
              disabled={round === numberOfRounds}
              onClick={() => {
                if (round < numberOfRounds) {
                  setRound(round + 1);
                }
              }}
            >
              <ArrowForwardIosIcon />
            </Button>
          </Box>
        )}
      </div>
      {stats !== "teams" && (
        <TableContainer component={Box}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell> </TableCell>
                <TableCell> </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {board === Board.Qualy ? "Net Average" : "Net"}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {board === Board.Qualy ? "Handicap Average" : "Handicap"}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {board === Board.Qualy ? "Gross Average" : "Gross"}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{tableRows()}</TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default observer(TournamentDogfightStats);

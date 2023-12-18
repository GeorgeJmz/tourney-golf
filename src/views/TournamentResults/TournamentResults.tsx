import * as React from "react";
import { observer } from "mobx-react";
import UserViewModel from "../../viewModels/UserViewModel";
import TournamentViewModel from "../../viewModels/TournamentViewModel";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActionArea,
  CardContent,
  Grid,
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
import { convertMomentDate } from "../../helpers/convertDate";

import MenuItems from "../../components/MenuItems";
import HorizontalScoreCard from "../Play/components/HorizontalScoreCard";
import MatchViewModel from "../../viewModels/MatchViewModel";
import { set, toJS } from "mobx";

interface ITournamentStatsProps {
  user: UserViewModel;
}

const TournamentResults: React.FC<ITournamentStatsProps> = ({ user }) => {
  const userId = React.useMemo(() => user.getUserId(), []);

  const [userStats, setUserStats] = React.useState("");

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
      tournamentViewModel.getAllMatchesResultsByTournament();
    }
  }, [id]);

  const isMobile = () =>
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  const headerStyles = {
    border: 0,
    textAlign: "center",
    width: "20%",
    backgroundColor: "Green",
    color: "white",
    fontWeight: "bold",
  };

  const nameStyles = {
    filter: "drop-shadow(7px 7px 11px grey)",
    position: "sticky",
    left: 0,
    background: "#fff",
    zIndex: 2,
    border: "none",
    color: "rgb(118, 118, 118);",
    width: 120,
    height: 100,
    textAlign: "center",
    fontSize: isMobile() ? "11px" : "inherit",
  };

  const cellStyles = {
    border: 1,
    color: "rgb(118, 118, 118);",
    width: 80,
    textAlign: "center",
  };

  const styleTable = {
    width: isMobile() ? "100%" : "48%",
  };

  return (
    <Box sx={{ background: "white", p: 3, height: "100vh" }}>
      <MenuItems
        options={tournamentViewModel.playersResultsOptions}
        placeholder="All Results"
        onChange={setUserStats}
        isActive={true}
      />

      <Typography gutterBottom align="left" variant="h6" component="div">
        Previous Matches
      </Typography>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "stretch",
        }}
      >
        {tournamentViewModel.leagueResults
          .filter((value) => {
            return userStats !== ""
              ? value.matchResults.some(
                  (element) => element.idPlayer === userStats
                )
              : true;
          })
          .map((match) => (
            <div style={styleTable}>
              <TableContainer component={Box}>
                <Table sx={{tableLayout: "fixed"}}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={nameStyles}>
                        {" "}
                        {convertMomentDate(match.date)}{" "}
                      </TableCell>
                      <TableCell sx={headerStyles}>Match</TableCell>
                      <TableCell sx={headerStyles}>Gross</TableCell>
                      <TableCell sx={headerStyles}>HDCP</TableCell>
                      <TableCell sx={headerStyles}>Net</TableCell>
                      <TableCell sx={headerStyles}>Team</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <React.Fragment>
                      {match.matchResults.map((players) => (
                        <TableRow
                          key={`${match.author} - ${players.playerName}`}
                        >
                          <TableCell sx={nameStyles}>
                            {players.playerName}
                          </TableCell>
                          <TableCell sx={cellStyles}>
                            {match.matchResults[0].isWinnerMatch &&
                            match.matchResults[1].isWinnerMatch
                              ? "Tie Match"
                              : players.isWinnerMatch
                              ? "Winner Match"
                              : ""}
                            <br />
                            {match.matchResults[0].isWinnerMedalPlay &&
                            match.matchResults[1].isWinnerMedalPlay
                              ? "Tie Medal"
                              : players.isWinnerMedalPlay
                              ? "Winner Medal"
                              : ""}
                          </TableCell>
                          <TableCell sx={cellStyles}>{players.gross}</TableCell>
                          <TableCell sx={cellStyles}>{players.hcp}</TableCell>
                          <TableCell sx={cellStyles}>{players.score}</TableCell>
                          <TableCell sx={cellStyles}>
                            {players.teamPoints}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell sx={{ textAlign: "center" }}></TableCell>
                        <TableCell sx={{ textAlign: "center" }}>{}</TableCell>
                        <TableCell sx={{ textAlign: "center" }} colSpan={3}>
                          <Button>View Scorecard</Button>
                        </TableCell>

                        <TableCell sx={{ textAlign: "center" }}></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ textAlign: "center" }}></TableCell>
                        <TableCell sx={{ textAlign: "center" }}></TableCell>
                        <TableCell sx={{ textAlign: "center" }}></TableCell>
                        <TableCell sx={{ textAlign: "center" }}></TableCell>
                        <TableCell sx={{ textAlign: "center" }}></TableCell>
                        <TableCell sx={{ textAlign: "center" }}></TableCell>
                      </TableRow>
                    </React.Fragment>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          ))}
      </div>
    </Box>
  );
};

export default observer(TournamentResults);

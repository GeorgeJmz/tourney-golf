import React from "react";
import UserViewModel from "../../../viewModels/UserViewModel";
import { observer } from "mobx-react";
import {
  Stack,
  Box,
  Typography,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import NewTheme from "../../../components/NewTheme/NewTheme";
import { useNavigate, useParams } from "react-router-dom";
import HeaderDashboard from "../../../components/HeaderDashboard/HeaderDashboard";
import { Link } from "react-router-dom";
import { URLS } from "../../../helpers/URLS";
import {
  convertMomentSimplified,
  differenceDate,
} from "../../../helpers/convertDate";
import { SelectMenuItems } from "../../../components/SelectMenuItems";
import TournamentViewModel from "../../../viewModels/TournamentViewModel";

interface IResultsLeagueProps {
  user: UserViewModel;
}

export const ResultsLeague: React.FC<IResultsLeagueProps> = observer(
  ({ user }) => {
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

    const tournamentType = tournamentViewModel.tournament.tournamentType;
    const playType = tournamentViewModel.tournament.playType;

    const isLTMATCH =
      tournamentType === "leagueteamplay" && playType === "matchPlay";
    const isLTMEDAL =
      tournamentType === "leagueteamplay" && playType === "strokePlay";
    const isLMATCH = tournamentType === "league" && playType === "matchPlay";
    const isLMEDAL = tournamentType === "league" && playType === "strokePlay";
    const isLMATCHMEDAL =
      tournamentType === "league" && playType === "matchstrokePlay";

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
      backgroundColor: "#BDFF69",
      color: "black",
      fontWeight: "bold",
    };

    const nameStyles = {
      position: "sticky",
      left: 0,
      background: "black",
      zIndex: 2,
      border: "1px solid white",
      color: "white",
      width: 120,
      height: 100,
      textAlign: "center",
      fontSize: isMobile() ? "11px" : "inherit",
    };

    const cellStyles = {
      border: "1px solid white",
      color: "white",
      width: 80,
      textAlign: "center",
    };

    const styleTable = {
      width: isMobile() ? "100%" : "48%",
    };
    const hideTeam = tournamentType === "league";
    const hideMatch = playType === "strokePlay";
    const hideMedal = playType === "matchPlay";

    return (
      <React.Fragment>
        <NewTheme>
          <Box
            sx={(theme) => ({
              display: "flex",
              alignItems: "top",
              justifyContent: "space-around",
              minHeight: "100vh",
              paddingX: theme.spacing(3),
              maxWidth: "1280px",
              margin: "auto",
              marginTop: theme.spacing(6),
            })}
          >
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={3}
              sx={{ height: "100%" }}
            >
              <HeaderDashboard text={currentTournament?.name || ""} />
              <Box sx={{ p: 3 }}>
                <SelectMenuItems
                  options={tournamentViewModel.playersResultsOptions}
                  placeholder="All Results"
                  onChange={setUserStats}
                  isActive={false}
                />

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "stretch",
                    marginTop: "20px",
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
                    .sort((a, b) => differenceDate(a.date, b.date))
                    .map((match) => (
                      <div style={styleTable}>
                        <TableContainer component={Box}>
                          <Table sx={{ tableLayout: "fixed" }}>
                            <TableHead>
                              <TableRow>
                                <TableCell sx={headerStyles}>
                                  {" "}
                                  {convertMomentSimplified(match.date)}{" "}
                                </TableCell>
                                <TableCell sx={headerStyles}>Match</TableCell>
                                <TableCell sx={headerStyles}>Gross</TableCell>
                                <TableCell sx={headerStyles}>HDCP</TableCell>
                                <TableCell sx={headerStyles}>Net</TableCell>
                                {!hideTeam && (
                                  <TableCell sx={headerStyles}>Team</TableCell>
                                )}
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
                                      {!isLMEDAL &&
                                        !isLTMEDAL &&
                                        (match.matchResults[0].isWinnerMatch &&
                                        match.matchResults[1].isWinnerMatch
                                          ? "Tie Match"
                                          : players.isWinnerMatch
                                          ? "Winner Match"
                                          : "")}
                                      <br />
                                      {!isLTMATCH &&
                                        !isLMATCH &&
                                        (match.matchResults[0]
                                          .isWinnerMedalPlay &&
                                        match.matchResults[1].isWinnerMedalPlay
                                          ? "Tie Medal"
                                          : players.isWinnerMedalPlay
                                          ? "Winner Medal"
                                          : "")}
                                    </TableCell>
                                    <TableCell sx={cellStyles}>
                                      {players.gross}
                                    </TableCell>
                                    <TableCell sx={cellStyles}>
                                      {players.hcp}
                                    </TableCell>
                                    <TableCell sx={cellStyles}>
                                      {players.score}
                                    </TableCell>
                                    {!isLMATCH &&
                                      !isLMEDAL &&
                                      !isLMATCHMEDAL && (
                                        <TableCell sx={cellStyles}>
                                          {players.teamPoints}
                                        </TableCell>
                                      )}
                                  </TableRow>
                                ))}
                                <TableRow>
                                  <TableCell
                                    sx={{ textAlign: "center" }}
                                  ></TableCell>
                                  <TableCell sx={{ textAlign: "center" }}>
                                    {}
                                  </TableCell>
                                  <TableCell
                                    sx={{ textAlign: "right" }}
                                    colSpan={2}
                                  ></TableCell>

                                  <TableCell
                                    sx={{ textAlign: "center" }}
                                    colSpan={2}
                                  >
                                    {" "}
                                    <Link
                                      to={`/match/${match.scoresId[0]}-${
                                        match.scoresId[1]
                                      }-match-${
                                        !hideMatch ? "true" : "false"
                                      }-team-${
                                        !hideTeam ? "true" : "false"
                                      }-medal-${!hideMedal ? "true" : "false"}`}
                                    >
                                      <Button
                                        variant="outlined"
                                        color="secondary"
                                        sx={{
                                          color: "white",
                                        }}
                                      >
                                        View Scorecard
                                      </Button>
                                    </Link>
                                  </TableCell>
                                </TableRow>
                              </React.Fragment>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </div>
                    ))}
                </div>
              </Box>
            </Stack>
          </Box>
        </NewTheme>
      </React.Fragment>
    );
  }
);

import * as React from "react";
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
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import { convertMomentDate, differenceDate } from "../../helpers/convertDate";
import MenuItems from "../../components/MenuItems";
import { IMatch } from "../../models/Match";

interface IDerbyResultsProps {
  user: UserViewModel;
}

const DerbyResults: React.FC<IDerbyResultsProps> = ({ user }) => {
  const userId = React.useMemo(() => user.getUserId(), []);

  const [userStats, setUserStats] = React.useState("");

  const tournamentViewModel = React.useMemo(
    () => new TournamentViewModel(),
    []
  );
  const { id } = useParams();
  const currentTournament = React.useMemo(
    () =>
      user.activeTournaments.find((t) => t.id === id) ||
      user.historyTournaments.find((t) => t.id === id),
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
    width: "25%",
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
    textAlign: "center",
  };

  const styleTable = {
    paddingBottom: "50px",
    minWidth: isMobile() ? "100%" : "48%",
  };

  const getLink = (match: IMatch) => {
    const scoresId = (match.scoresId || []).join("-");
    // Derby: hideMatch=true, hideTeam=true, hideMedal=false, hideWinner=false
    // URL format: match-{showMatch}-team-{showTeam}-medal-{showMedal}-winner-{showWinner}
    // So we pass the inverse: match-false-team-false-medal-true-winner-true
    return `/match/${scoresId}-match-${false}-team-${false}-medal-${true}-winner-${true}-matchid-${match.id}`;
  };

  return (
    <Box sx={{ background: "white", p: 3, height: "100vh" }}>
      <MenuItems
        options={tournamentViewModel.playersResultsOptions}
        placeholder="All Results"
        onChange={setUserStats}
        isActive={true}
      />

      {userStats !== "" && (
        <Typography gutterBottom align="left" variant="h6" component="div">
          Derby Results
        </Typography>
      )}

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
          .sort((a, b) => differenceDate(b.date, a.date))
          .map((match) => (
            <div key={match.id} style={styleTable}>
              <TableContainer component={Box}>
                <Table sx={{ tableLayout: "fixed" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={nameStyles}>
                        {convertMomentDate(match.date)}
                        {match.round !== undefined && (
                          match.round === 0 
                            ? " - Championship"
                            : ` - Stage ${match.round}`
                        )}
                        <br />
                        <span style={{ fontSize: isMobile() ? "10px" : "13px", fontWeight: "normal", color: "rgb(100, 100, 100)" }}>
                          {match.courseDisplayName}
                          {match.teeBoxDisplayName && ` - ${match.teeBoxDisplayName}`}
                        </span>
                      </TableCell>
                      <TableCell sx={headerStyles}>Gross</TableCell>
                      <TableCell sx={headerStyles}>HDCP</TableCell>
                      <TableCell sx={headerStyles}>Net</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <React.Fragment>
                      {match.matchResults
                        .slice()
                        .sort((a, b) => a.score - b.score) // Ordenar por Net (menor a mayor)
                        .map((player) => (
                          <TableRow
                            key={`${match.author} - ${player.playerName}`}
                          >
                            <TableCell sx={nameStyles}>
                              {player.playerName}
                            </TableCell>
                            <TableCell sx={cellStyles}>{player.gross}</TableCell>
                            <TableCell sx={cellStyles}>{player.hcp}</TableCell>
                            <TableCell sx={cellStyles}>{player.score}</TableCell>
                          </TableRow>
                        ))}
                      <TableRow>
                        <TableCell sx={{ textAlign: "center" }}></TableCell>
                        <TableCell sx={{ textAlign: "center" }} colSpan={3}>
                          <Link to={getLink(match)}>
                            <Button variant="text" color="primary">
                              View Scorecard
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                      <TableRow>
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

export default observer(DerbyResults);


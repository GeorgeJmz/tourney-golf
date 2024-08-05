import React, { useEffect, useMemo } from "react";
import UserViewModel from "../../../viewModels/UserViewModel";
import { observer } from "mobx-react";
import { Stack, Box, Typography, Button } from "@mui/material";
import NewTheme from "../../../components/NewTheme/NewTheme";
import { useParams } from "react-router-dom";
import TournamentViewModel from "../../../viewModels/TournamentViewModel";
import HeaderDashboard from "../../../components/HeaderDashboard/HeaderDashboard";
import { Link } from "react-router-dom";
import { URLS } from "../../../helpers/URLS";
import { convertDate } from "../../../helpers/convertDate";

interface ILeagueProps {
  user: UserViewModel;
}

export const League: React.FC<ILeagueProps> = observer(({ user }) => {
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

  const isDogfight = useMemo(
    () => currentTournament?.tournamentType === "dogfight",
    [currentTournament?.tournamentType]
  );
  if (currentTournament && id && tournamentViewModel.author === "") {
    tournamentViewModel.setTournament(currentTournament);
    tournamentViewModel.setTournamentId(id);
    tournamentViewModel.setAuthor(userId);
    tournamentViewModel.getStatsPlayersByTournament();
    console.log("TournamentPage currentTournament", currentTournament);
  }
  useEffect(() => {
    if (user) {
      user.getTournaments();
      user.getActiveTournaments();
    }
  }, []);

  const isActiveTournament = React.useMemo(() => {
    const endDate = convertDate(
      currentTournament?.cutOffDate || "",
      "MM/DD/YYYY"
    );
    const today = convertDate(new Date().toISOString(), "MM/DD/YYYY");

    const compareDates = (d1: string, d2: string) => {
      const date1 = new Date(d1).getTime();
      const date2 = new Date(d2).getTime();
      if (date1 < date2) {
        return false;
        //console.log(`${d1} is less than ${d2}`);
      } else if (date1 > date2) {
        return true;
        //console.log(`${d1} is greater than ${d2}`);
      } else {
        return true;
      }
    };

    return compareDates(endDate, today);
  }, [currentTournament?.cutOffDate]);

  const standings = [
    tournamentViewModel.statsPlayers[0] ?? [],
    tournamentViewModel.statsPlayers[1] ?? [],
    tournamentViewModel.statsPlayers[2] ?? [],
  ];
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
            <Box width="100%">
              <Typography
                variant="h5"
                align="center"
                sx={{
                  fontWeight: 700,
                  fontSize: "32px",
                  color: "white",
                  lineHeight: "36px",
                  textTransform: "uppercase",
                }}
              >
                Standings
              </Typography>
              {standings.map((player, index) => (
                <Box
                  display="flex"
                  color="white"
                  justifyContent="space-between"
                  sx={{
                    borderLeft: "2px solid",
                    borderBottom: "2px solid",
                    borderColor: "primary.main",
                    paddingLeft: 1,
                    paddingRight: 1,
                    alignItems: "center",
                    marginBottom: 2,
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: 40,
                        fontWeight: 600,
                        fontFamily: "'MDNichromeTestBold', sans-serif",
                        letterSpacing: "3px",
                      }}
                    >
                      {index + 1}
                    </Typography>
                  </Box>
                  <Box sx={{ color: "white", fontWeight: 700 }}>
                    {player.tourneyName}
                  </Box>
                  <Box
                    sx={{
                      border: "1px solid",
                      borderColor: "primary.main",
                      padding: 1,
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    {isDogfight ? player.netAverage : player.totalPoints}
                  </Box>
                </Box>
              ))}
            </Box>
            <Box
              width="100%"
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gridTemplateColumns: "repeat(2, 1fr)", // Dos columnas en pantallas pequeñas
                gap: "1rem",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  minWidth: "200px",
                }}
              >
                {isActiveTournament ? (
                  <Link
                    to={`${
                      isDogfight ? URLS.PLAYDOGFIGHT : URLS.PLAYLEAGUE
                    }${id}`}
                  >
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      size="large"
                    >
                      Play
                    </Button>
                  </Link>
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    size="large"
                    disabled
                    sx={{
                      backgroundColor: "gray !important",
                    }}
                  >
                    Play
                  </Button>
                )}
              </Box>
              <Box
                sx={{
                  minWidth: "200px",
                }}
              >
                <Link
                  to={`${
                    isDogfight ? URLS.RESULTSDOGFIGHT : URLS.RESULTSLEAGUE
                  }${id}`}
                >
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    size="large"
                  >
                    Results
                  </Button>
                </Link>
              </Box>
              <Box
                sx={{
                  minWidth: "200px",
                }}
              >
                <Link
                  to={`${
                    isDogfight ? URLS.STATSDOGFIGHT : URLS.STATSLEAGUE
                  }${id}`}
                >
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    size="large"
                  >
                    Stats
                  </Button>
                </Link>
              </Box>
              {!isDogfight && (
                <Box
                  sx={{
                    minWidth: "200px",
                  }}
                >
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    size="large"
                    disabled
                    sx={{
                      borderColor: "gray !important",
                      color: "gray !important",
                    }}
                  >
                    Playoffs
                  </Button>
                </Box>
              )}
              <Box
                sx={{
                  minWidth: "200px",
                }}
              >
                <Link to={`${URLS.RULES}${id}`}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    size="large"
                  >
                    Rules
                  </Button>
                </Link>
              </Box>
            </Box>
          </Stack>
        </Box>
      </NewTheme>
    </React.Fragment>
  );
});

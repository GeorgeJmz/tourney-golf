import React, { useEffect } from "react";
import UserViewModel from "../../../viewModels/UserViewModel";
import { Link } from "react-router-dom";
import { Button, IconButton } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import { observer } from "mobx-react";
import { Stack, Box, Grid, Typography } from "@mui/material";
import NewTheme from "../../../components/NewTheme/NewTheme";
import HeaderDashboard from "../../../components/HeaderDashboard/HeaderDashboard";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { stringName } from "../../../helpers/stringAvatar";
import DashboardRow from "../../../components/DashboardRow/DashboardRow";
import DashboardTitle from "../../../components/DashboardTitle/DashboardTitle";
import { URLS } from "../../../helpers/URLS";

interface IDashboardProps {
  user: UserViewModel;
}

interface IhistoryLeague {
  champion: string;
  year: number;
  name: string;
}
interface IIdLeague {
  [key: string]: IhistoryLeague[];
}

export const Dashboard: React.FC<IDashboardProps> = observer(({ user }) => {
  const [showHistory, setShowHistory] = React.useState(false);

  const leagueHistoryMulligans = [
    {
      champion: "Juan Kim",
      year: 2016,
      name: "Mulligans",
    },
    {
      champion: "Juan Morales",
      year: 2017,
      name: "Mulligans",
    },
    {
      champion: "Sonny Covarrubias",
      year: 2018,
      name: "Mulligans",
    },
    {
      champion: "Jose Luis Gil",
      year: 2019,
      name: "Mulligans",
    },
    {
      champion: "Carlos Mattei",
      year: 2021,
      name: "Mulligans",
    },
    {
      champion: "Juan Morales",
      year: 2022,
      name: "Mulligans",
    },
    {
      champion: "Adrian Lara",
      year: 2023,
      name: "Mulligans",
    },
  ] as IhistoryLeague[];
  const leagueHistoryGorillas = [
    {
      champion: "Jorge Jimenez",
      year: 2003,
      name: "Gorilas",
    },
    {
      champion: "Joshue Gross",
      year: 2004,
      name: "Gorilas",
    },
    {
      champion: "Jose Carlos Perez",
      year: 2005,
      name: "Gorilas",
    },
    {
      champion: "Julio Rodriguez",
      year: 2006,
      name: "Gorilas",
    },
    {
      champion: "Oscar Foglio",
      year: 2007,
      name: "Gorilas",
    },
    {
      champion: "Joshue Gross",
      year: 2008,
      name: "Gorilas",
    },
    {
      champion: "Gabriel Garcia de Leon",
      year: 2009,
      name: "Gorilas",
    },
    {
      champion: "Luis Togno",
      year: 2010,
      name: "Gorilas",
    },
    {
      champion: "Joshue Gross",
      year: 2011,
      name: "Gorilas",
    },
    {
      champion: "Leonardo Andujo",
      year: 2012,
      name: "Gorilas",
    },
    {
      champion: "Andres Lujan",
      year: 2013,
      name: "Gorilas",
    },
    {
      champion: "Felipe Acosta",
      year: 2014,
      name: "Gorilas",
    },
    {
      champion: "Leonardo Andujo ",
      year: 2015,
      name: "Gorilas",
    },
    {
      champion: "Alejandro Valenzuela ",
      year: 2016,
      name: "Gorilas",
    },
    {
      champion: "Juan Pablo Alcocer",
      year: 2017,
      name: "Gorilas",
    },
    {
      champion: "Philippe Caymaris",
      year: 2018,
      name: "Gorilas",
    },
    {
      champion: "Damian Salazar",
      year: 2019,
      name: "Gorilas",
    },
    {
      champion: "Jose Lopez ",
      year: 2020,
      name: "Gorilas",
    },
    {
      champion: "Leonardo Andujo",
      year: 2021,
      name: "Gorilas",
    },
    {
      champion: "Humberto Martinez ",
      year: 2022,
      name: "Gorilas",
    },
    {
      champion: "Alejandro Valenzuela Sr",
      year: 2023,
      name: "Gorilas",
    },
  ] as IhistoryLeague[];
  const [historyLeague, setHistoryLeague] = React.useState(
    [] as IhistoryLeague[]
  );
  useEffect(() => {
    const mapLeagues = {
      Al3hhHdhgzDNvATsrsT1: leagueHistoryGorillas.reverse(),
      rt7KCe7b8ZKLCjiux6nn: leagueHistoryMulligans.reverse(),
    } as IIdLeague;

    let empty: IhistoryLeague[] = [];
    user.activeTournaments.forEach((active) => {
      if (mapLeagues[active.id || ""]) {
        empty = [...empty, ...mapLeagues[active.id || ""]];
      }
    });

    setHistoryLeague(empty);
  }, [user.activeTournaments]);
  useEffect(() => {
    if (user) {
      user.getTournaments();
      user.getActiveTournaments();
    }
  }, []);

  return (
    <React.Fragment>
      <NewTheme hideNav>
        <Box
          sx={(theme) => ({
            display: "flex",
            alignItems: "top",
            justifyContent: "space-around",
            minHeight: "100vh",
            paddingX: theme.spacing(3),
            maxWidth: "1280px",
            margin: "auto",
          })}
        >
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={3}
            sx={{ height: "100%" }}
          >
            <HeaderDashboard text="STARTER" />
            <DashboardRow
              title="League Action"
              tournaments={user.activeTournaments}
              url={URLS.LEAGUE}
            />
            <Box width="100%">
              <DashboardTitle>Stakes</DashboardTitle>
            </Box>
            <Box width="100%">
              <DashboardTitle>
                League History{" "}
                <IconButton
                  aria-label="expandMore"
                  onClick={() => setShowHistory((prev) => !prev)}
                >
                  {!showHistory ? (
                    <ExpandMoreIcon color="primary" />
                  ) : (
                    <ExpandLessIcon color="primary" />
                  )}
                </IconButton>
              </DashboardTitle>
              <Collapse in={showHistory}>
                <Box>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    {historyLeague.map((league) => (
                      <Grid item xs={12} md={4} lg={2} key={league.name}>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Box>
                            <Typography
                              color="primary"
                              gutterBottom
                              variant="h6"
                              component="div"
                              sx={{
                                fontSize: "1rem",
                                textAlign: "center",
                                maxWidth: "100px",
                              }}
                            >
                              {league.champion}
                            </Typography>
                          </Box>
                          <Box
                            borderLeft="1px solid"
                            height="20px"
                            sx={(theme) => ({
                              borderColor: theme.palette.secondary.main,
                            })}
                          ></Box>
                          <Box>
                            <Typography variant="body2" color="primary">
                              Champion
                            </Typography>
                            <Typography variant="body2" color="primary">
                              {league.name} {league.year}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Collapse>
            </Box>
            <DashboardRow
              title="League Admin"
              tournaments={user.tournaments}
              url={URLS.LEAGUEADMIN}
            />
            <Box display="flex" justifyContent="space-between" width="100%">
              <Link to={URLS.EDITPROFILE}>
                <Button
                  variant="text"
                  color="secondary"
                  sx={{ width: "50px" }}
                  size="small"
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                      }}
                    >
                      {stringName(`${user.user.name} ${user.user.lastName}`)}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                        textTransform: "initial",
                      }}
                    >
                      Profile
                    </Typography>
                  </Box>
                </Button>
              </Link>
              <Link to={URLS.CREATELEAGUE}>
                <Button
                  variant="text"
                  color="secondary"
                  sx={{ width: "50px" }}
                  size="small"
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontSize: "2.9rem",
                        lineHeight: "0.67",
                      }}
                    >
                      +
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                        textTransform: "initial",
                      }}
                    >
                      League
                    </Typography>
                  </Box>
                </Button>
              </Link>
            </Box>
            <Box>
              <img
                src="../../logo 3_b.jpg"
                style={{
                  width: "100%",
                  maxWidth: "500px",
                }}
                alt="TEE BOX"
              />
            </Box>
          </Stack>
        </Box>
      </NewTheme>
    </React.Fragment>
  );
});

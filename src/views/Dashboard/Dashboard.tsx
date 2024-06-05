import React, { useEffect } from "react";
import { observer } from "mobx-react";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Collapse from "@mui/material/Collapse";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import SportsGolfIcon from "@mui/icons-material/SportsGolf";
import AssessmentIcon from "@mui/icons-material/Assessment";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import UserViewModel from "../../viewModels/UserViewModel";
import { stringAvatar } from "../../helpers/stringAvatar";
import { Link } from "react-router-dom";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Button, CardActionArea, CardMedia } from "@mui/material";
import Grid from "@mui/material/Grid";
import moment from "moment-timezone";
import { convertDate } from "../../helpers/convertDate";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

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
const Dashboard: React.FC<IDashboardProps> = ({ user }) => {
  const [value, setValue] = React.useState(0);
  const [showHistory, setShowHistory] = React.useState(false);
  const formatDate = (eventDate: number, eventTimezone: string) => {
    const formattedDate = moment(eventDate)
      .tz(eventTimezone)
      .format("MMMM Do YYYY, h:mm a");
    return formattedDate;
  };
  useEffect(() => {
    if (user) {
      user.getTournaments();
      //user.getMatches();
      user.getActiveTournaments();
    }
  }, []);

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

  return (
    <div>
      {user && (
        <Paper sx={{ my: 2, display: "flex", justifyContent: "space-around" }}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar
                {...stringAvatar(`${user.user.name} ${user.user.lastName}`)}
              />
            </ListItemAvatar>
            <ListItemText
              primary={`${user.user.name} ${user.user.lastName}`}
              secondary={
                <Typography
                  sx={{ display: "inline" }}
                  component="span"
                  variant="caption"
                  color="text.primary"
                >
                  {user.user.email}
                </Typography>
              }
            />
          </ListItem>
          <ListItem sx={{ width: "auto" }}>
            <Link to="/edit-profile">
              <Button variant="outlined" sx={{ width: "120px" }} size="small">
                Edit Profile
              </Button>
            </Link>
          </ListItem>
        </Paper>
      )}
      {/* <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography gutterBottom align="left" variant="h6" component="div">
            Manage your Previous Matches
          </Typography>
        </Grid>
        {user.matches.map((match) => (
          <Grid item xs={6} md={4} lg={3} key={match.course}>
            <Card>
              <CardActionArea>
                <CardContent>
                  <Typography variant="body1" color="text.secondary">
                    {match.courseDisplayName} - {match.teeBoxDisplayName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Winner - {match.winner} -{" "}
                    {formatDate(parseInt(match.date[0]), match.date[1])}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid> */}
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <Typography gutterBottom align="left" variant="h6" component="div">
            League Action
          </Typography>
        </Grid>
        {user.activeTournaments.map((tournament) => (
          <Grid item xs={6} md={4} lg={2} key={tournament.name}>
            <Link to={`/tournament/${tournament.id}`}>
              <Card>
                <CardActionArea>
                  <CardContent
                    sx={{
                      textAlign: "center",
                      lineHeight: "0.5",
                      minHeight: "80px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      sx={{ lineHeight: "1" }}
                    >
                      {tournament.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <Typography gutterBottom align="left" variant="h6" component="div">
            TEE BOX Stakes
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <Typography gutterBottom align="left" variant="h6" component="div">
            League History{" "}
            <IconButton
              aria-label="expandMore"
              onClick={() => setShowHistory((prev) => !prev)}
            >
              {!showHistory ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </IconButton>
          </Typography>
          <Collapse in={showHistory}>
            <Box>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {historyLeague.map((league) => (
                  <Grid item xs={6} md={4} lg={2} key={league.name}>
                    <Card>
                      <CardContent>
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          sx={{
                            fontSize: "1rem",
                          }}
                        >
                          {league.champion}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Champion
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {league.name} {league.year}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Collapse>

          {/* <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              League History
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {leagueHistory.reverse().map((league) => (
                  <Grid item xs={6} md={4} lg={2} key={league.name}>
                    <Card>
                      <CardContent>
                      <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          sx={{
                            fontSize: "1rem",
                          }}
                        >
                          {league.champion}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Champion
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {league.name} {league.year}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion> */}
        </Grid>
        <Grid></Grid>
      </Grid>
      <Grid container spacing={2} sx={{ mt: 1, pb: 4 }}>
        <Grid item xs={6}>
          <Typography gutterBottom align="left" variant="h6" component="div">
            League Admin
          </Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Link to="/create-tournament">
            <Button variant="outlined" size="small">
              New League
            </Button>
          </Link>
        </Grid>
        {user.tournaments.map((tournament) => (
          <Grid item xs={6} md={4} lg={2} key={tournament.name}>
            <Link to={`/manage-tournament/${tournament.id}`}>
              <Card>
                <CardActionArea>
                  <CardContent sx={{ textAlign: "center", lineHeight: "0.5" }}>
                    <Typography gutterBottom variant="h6" component="div">
                      {tournament.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {tournament?.playersList?.length || 0} Players
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>

      {/* <Box sx={{ "& > :not(style)": { m: 1 } }}>
        <Link to="/create-tournament">
          <Fab variant="extended">
            <AddIcon color="primary" sx={{ mr: 1 }} />
            New Tourney
          </Fab>
        </Link>
      </Box>
      <Box sx={{ "& > :not(style)": { m: 1 } }}>
        <Link to="/play">
          <Fab variant="extended">
            <AddIcon color="primary" sx={{ mr: 1 }} />
            Play
          </Fab>
        </Link>
      </Box> */}
      {/* <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction label="Home" icon={<HomeIcon />} />
          <BottomNavigationAction label="Play" icon={<SportsGolfIcon />} />
          <BottomNavigationAction label="Stats" icon={<AssessmentIcon />} />
        </BottomNavigation>
      </Paper> */}
    </div>
  );
};

export default observer(Dashboard);

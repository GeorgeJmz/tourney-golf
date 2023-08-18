import React, { useEffect } from "react";
import { observer } from "mobx-react";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
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
import { CardActionArea } from "@mui/material";
import Grid from "@mui/material/Grid";
import moment from "moment-timezone";

interface IDashboardProps {
  user: UserViewModel;
}
const Dashboard: React.FC<IDashboardProps> = ({ user }) => {
  const [value, setValue] = React.useState(0);
  const formatDate = (eventDate: number, eventTimezone: string) => {
    const formattedDate = moment(eventDate)
      .tz(eventTimezone)
      .format("MMMM Do YYYY, h:mm a");
    return formattedDate;
  };
  useEffect(() => {
    if (user) {
      user.getTournaments();
      user.getMatches();
    }
  }, []);
  return (
    <div>
      {user && (
        <Paper sx={{ my: 2 }}>
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
        </Paper>
      )}
      <Grid container spacing={2}>
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
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography gutterBottom align="left" variant="h6" component="div">
            Manage your tournaments
          </Typography>
        </Grid>
        {user.tournaments.map((tournament) => (
          <Grid item xs={6} md={4} lg={3} key={tournament.name}>
            <Card>
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {tournament.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tournament.tournamentType}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tournament.players}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ "& > :not(style)": { m: 1 } }}>
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
      </Box>
      <Paper
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
      </Paper>
    </div>
  );
};

export default observer(Dashboard);

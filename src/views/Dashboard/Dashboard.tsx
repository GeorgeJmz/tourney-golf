import React, { useEffect } from "react";
import { observer } from "mobx-react";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";

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
import { Button, CardActionArea } from "@mui/material";
import Grid from "@mui/material/Grid";
import moment from "moment-timezone";
import { convertDate } from "../../helpers/convertDate";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

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
      //user.getMatches();
      user.getActiveTournaments();
    }
  }, []);
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
            <img src="/teebox.png" width="20" alt="TEE BOX" /> League Action
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
            <img src="/teebox.png" width="20" alt="TEE BOX" /> TEE BOX
            Challenges
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <Typography gutterBottom align="left" variant="h6" component="div">
            <img src="/teebox.png" width="20" alt="TEE BOX" /> League History
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ mt: 1, pb: 4 }}>
        <Grid item xs={6}>
          <Typography gutterBottom align="left" variant="h6" component="div">
            <img src="/teebox.png" width="20" alt="TEE BOX" /> League Admin
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
                    <Typography variant="body2" color="text.secondary">
                      {`${convertDate(tournament.startDate)} - ${convertDate(
                        tournament.cutOffDate
                      )}`}
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

import React, { useState } from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import { useGetLeagues } from "../../hooks/useGetLeagues";
import { useHistoryLeague } from "../../hooks/useHistoryLeague";
import { stringAvatar } from "../../helpers/stringAvatar";

import {
  Paper,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Button,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  IconButton,
  Collapse,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import UserViewModel from "../../viewModels/UserViewModel";

interface IDashboardProps {
  user: UserViewModel;
}

const Dashboard: React.FC<IDashboardProps> = ({ user }) => {
  const [showHistory, setShowHistory] = useState(false);
  useGetLeagues(user);

  const { historyLeague } = useHistoryLeague(
    user.tournaments,
    user.historyTournaments
  );

  return (
    <div>
      {/* Información del usuario */}
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
                <Typography variant="caption" color="text.primary">
                  {user.user.email}
                </Typography>
              }
            />
          </ListItem>
          <ListItem sx={{ width: "auto" }}>
            <Link to="/edit-profile">
              <Button variant="outlined" size="small">
                Edit Profile
              </Button>
            </Link>
          </ListItem>
        </Paper>
      )}

      {/* Ligas Activas */}
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

      {/* Historial de Ligas */}
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <Typography gutterBottom align="left" variant="h6" component="div">
            League History
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
                    <Link
                      to={
                        league.id
                          ? league.isTeamplay
                            ? `/history-league-teamplay/${league.id}`
                            : `/history-league/${league.id}`
                          : "#"
                      }
                    >
                      <Card>
                        <CardContent>
                          <Typography
                            gutterBottom
                            variant="h6"
                            component="div"
                            sx={{ fontSize: "1rem" }}
                          >
                            {league.champion}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Champion
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {league.name} {league.year && `- ${league.year}`}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Link>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Collapse>
        </Grid>
      </Grid>

      {/* Ligas Administradas */}
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
    </div>
  );
};

export default observer(Dashboard);

import React from "react";
import { observer } from "mobx-react";
import { logout } from "../../services/firebase";
import { useAuth } from "../../hooks/useUserContext";
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
import LogoutIcon from "@mui/icons-material/Logout";
import IconButton from "@mui/material/IconButton";
import CreateTournament from "../CreateTournament/CreateTournament";
import UserViewModel from "../../viewModels/UserViewModel";
import { stringAvatar } from "../../helpers/stringAvatar";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [value, setValue] = React.useState(0);
  const userViewModel = new UserViewModel();
  if (user) {
    userViewModel.setUser(user);
  }

  return (
    <div>
      {user && (
        <ListItem
          alignItems="flex-start"
          secondaryAction={
            <IconButton aria-label="comment" onClick={logout}>
              <LogoutIcon />
            </IconButton>
          }
        >
          <ListItemAvatar>
            <Avatar
              {...stringAvatar(
                `${userViewModel.user.name} ${userViewModel.user.lastName}`
              )}
            />
          </ListItemAvatar>
          <ListItemText
            primary={`${userViewModel.user.name} ${userViewModel.user.lastName}`}
            secondary={
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="caption"
                color="text.primary"
              >
                {userViewModel.user.email}
              </Typography>
            }
          />
        </ListItem>
      )}
      <CreateTournament user={userViewModel} />
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
          <BottomNavigationAction label="Reports" icon={<AssessmentIcon />} />
        </BottomNavigation>
      </Paper>
    </div>
  );
};

export default observer(Dashboard);

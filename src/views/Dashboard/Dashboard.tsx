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

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [value, setValue] = React.useState(0);
  function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }
  function stringAvatar(name: string) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
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
            <Avatar {...stringAvatar(`${user.name} ${user.lastName}`)} />
          </ListItemAvatar>
          <ListItemText
            primary={`${user.name} ${user.lastName}`}
            secondary={
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="caption"
                color="text.primary"
              >
                {user.email}
              </Typography>
            }
          />
        </ListItem>
      )}
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

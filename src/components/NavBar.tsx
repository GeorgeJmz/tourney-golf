import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";
import { logout } from "../services/firebase";
import { useLocation, useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";

interface INavBarProps {
  children: React.ReactElement;
  isVisible: boolean;
}

function ElevationScroll(props: INavBarProps) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

export const NavBar: React.FC<INavBarProps> = (props: INavBarProps) => {
  const [title, setTitle] = React.useState("");
  const [isBackButton, setIsBackButton] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const useStyles = makeStyles({
    abRoot: {
      backgroundColor: "white !important",
      border: "1px solid #e0e0e0",
    },
  });
  const classes = useStyles(); // Invoke the makeStyles hook to get the styles object

  React.useEffect(() => {
    if (location.pathname === "/dashboard") {
      setTitle("Dashboard");
      setIsBackButton(false);
    }
    if (location.pathname.includes("/tournament/")) {
      setTitle("Tournament");
      setIsBackButton(true);
    }
    if (location.pathname === "/create-tournament") {
      setTitle("Create Tournament");
      setIsBackButton(true);
    }
    if (location.pathname === "/play") {
      setTitle("Play");
      setIsBackButton(true);
    }
    if (location.pathname.includes("/manage-tournament/")) {
      setTitle("Manage Tournament");
      setIsBackButton(true);
    }
  }, [location]);

  return (
    <React.Fragment>
      {props.isVisible && (
        <React.Fragment>
          <CssBaseline />
          <ElevationScroll {...props}>
            <AppBar className={classes.abRoot}>
              {" "}
              {/* Use the styles object */}
              <Toolbar sx={{ justifyContent: "space-between" }}>
                <Box>
                  {isBackButton && (
                    <IconButton
                      size="large"
                      edge="start"
                      color="primary"
                      aria-label="back"
                      sx={{ mr: 2 }}
                      onClick={() => navigate(-1)}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                  )}
                </Box>
                <Box>
                  <Typography
                    color="primary"
                    variant="h6"
                    fontWeight="700"
                    component="div"
                  >
                    {title}
                  </Typography>
                </Box>
                <Box>
                  <IconButton
                    color="primary"
                    aria-label="logout"
                    onClick={logout}
                  >
                    <LogoutIcon />
                  </IconButton>
                </Box>
              </Toolbar>
            </AppBar>
          </ElevationScroll>
          <Toolbar />
        </React.Fragment>
      )}
      <Container>
        <Box>{props.children}</Box>
      </Container>
    </React.Fragment>
  );
};

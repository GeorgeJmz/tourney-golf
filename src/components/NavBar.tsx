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
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { NavbarTitleContext } from "../hooks/useNavContext";

interface INavBarProps {
  children?: React.ReactElement;
  isVisible: boolean;
}

function ElevationScroll(props: INavBarProps) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window,
  });

  return React.cloneElement(children || <></>, {
    elevation: trigger ? 4 : 0,
  });
}

export const NavBar: React.FC<INavBarProps> = (props: INavBarProps) => {
  //const [title, setTitle] = React.useState("");
  const [isBackButton, setIsBackButton] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { title, setTitle } = React.useContext(NavbarTitleContext);

  const useStyles = makeStyles({
    abRoot: {
      backgroundColor: "white !important",
      border: "1px solid #e0e0e0",
    },
  });
  const classes = useStyles(); // Invoke the makeStyles hook to get the styles object

  React.useEffect(() => {
    if (location.pathname === "/dashboard") {
      setTitle("TEE BOX Dashboard");
      setIsBackButton(false);
    }
    if (location.pathname.includes("/tournament/")) {
      setIsBackButton(true);
    }
    if (location.pathname === "/create-tournament") {
      setTitle("Create League");
      setIsBackButton(true);
    }
    if (location.pathname.includes("/play-tournament/")) {
      setTitle("Play");
      setIsBackButton(false);
    }
    if (location.pathname.includes("/manage-tournament/")) {
      setTitle("Manage League");
      setIsBackButton(true);
    }
    window.scrollTo(0, 0);
  }, [location]);

  const isDevelopment = !window.location.href.includes("teeboxleague.com");

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
                {isBackButton && (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
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
                    <img src="/teebox.png" width="40" alt="TEE BOX" />
                  </Box>
                )}
                {!isBackButton && <Box></Box>}
                <Box>
                  <Typography
                    color="primary"
                    variant="h6"
                    fontWeight="700"
                    component="div"
                  >
                    {title}
                  </Typography>
                  {isDevelopment && (
                    <Typography
                      color="primary"
                      variant="caption"
                      component="div"
                    >
                      {location.pathname} - version 1.0.0 - Averages and column
                      positions
                    </Typography>
                  )}
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
      <Container
        sx={{
          padding: 0,
          "@media (min-width: 600px)": {
            padding: 0,
          },
        }}
      >
        <Box>
          <Outlet />
        </Box>
      </Container>
    </React.Fragment>
  );
};

import React from "react";
import { observer } from "mobx-react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useUserContext";
import { Button, Stack, Typography, Container } from "@mui/material";

const Welcome: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <React.Fragment>
      {user && <Navigate to="/dashboard" state={{ from: location }} replace />}
      {!user && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%"
          }}
        >
          <Container
            maxWidth="sm"
            sx={{
              display: { xs: "flex", lg: "flex" },
              alignItems: "center",
              justifyContent: "center",
              maxWidth: { xs: "25vw", lg: "25vw"},
              maxHeight: "100%",
              backdropFilter: "blur(50px)",
              margin: { xs: "0", lg: "0 0 -50 0"},
            }}
          >
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={3}
              sx={{ height: "100%" }}
            >
              <Container
                maxWidth="sm"
                sx={{
                  width: "100%"
                }}
              >
                <img src="logo2.png" style={{width: "100%"}} alt="TEE BOX" />
              </Container>
              <Typography
                variant="h3"
                sx={{
                  // fontStyle: "italic",
                  fontWeight: 800,
                  fontSize: { xs: "85px", lg: "95px" },
                  lineHeight: "90px",
                  textAlign: "center",
                  letterSpacing: "-6px",
                  textTransform: "uppercase",
                  // maxWidth: "500px",
                }}
              >
                TEE BOX League
              </Typography>
              <br />
              <Typography
                variant="subtitle1"
                sx={{
                  maxWidth: "400px",
                  textAlign: "center",
                  margin: "0 auto 5px auto",
                  fontSize: { xs: "1.5rem", lg: "1.7rem" }, 
                  lineHeight: ".65em"
                }}
              >
                Practice with purpose
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  maxWidth: "400px",
                  textAlign: "center",
                  margin: "0 auto 5px auto",
                  fontSize: { xs: "1.5rem", lg: "1.7rem" },
                  lineHeight: ".65em"
                }}
              >
                Play with an edge
              </Typography>
              
              <Typography
                variant="subtitle2"
                sx={{
                  maxWidth: "400px",
                  textAlign: "center",
                  margin: "0 auto 20px auto",
                  fontSize: { xs: "1.5rem", lg: "1.8rem" },
                }}
              >
                Be a league legend
              </Typography>
              <div>
                {/* <Typography variant="h5" color="primary.main">
                    Compete in your own season long league.
                  </Typography> */}
                {/* <Typography
                    variant="body1"
                    sx={{
                      maxWidth: "400px",
                      textAlign: "center",
                      margin: "10px auto",
                    }}
                  >
                    Track your progress, connect with other players, and master
                    your swing with our golf app.
                  </Typography> */}
              </div>
              <Stack
                direction="column"
                justifyContent="center"
                alignItems="stretch"
                spacing={2}
                sx={{ width: "100%", paddingBottom: "4em" }}
              >
                <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
                sx={{width: "100%", padding: {xs: "0em", lg: "0"}, margin: {xs: "0", lg: "0"}}}
                >
                  <Link to="/create-account">
                    <Button variant="outlined" color="secondary" 
                      sx={{ width: "100%" }} size="large">
                      sign up
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button
                      variant="contained"
                      size="large"
                      sx={{ width: "100%" }}
                    >
                      Login
                    </Button>
                  </Link>
                </Stack>
              </Stack>
            </Stack>
          </Container>
        </div>
      )}
    </React.Fragment>
  );
};

export default observer(Welcome);

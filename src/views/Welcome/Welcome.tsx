import React from "react";
import { observer } from "mobx-react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useUserContext";
import { Button, Stack, Typography, Paper, Container } from "@mui/material";

const Welcome: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  return (
    <React.Fragment>
      {user && <Navigate to="/dashboard" state={{ from: location }} replace />}
      {!user && (
        <Container
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <Paper
            elevation={3}
            sx={{ width: "95%", height: "85vh", padding: "0 20px" }}
          >
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={3}
              sx={{ height: "100%" }}
            >
              <img src="teebox.png" width="150" alt="TEE BOX" />
              <Typography
                variant="h3"
                sx={{
                  fontStyle: "italic",
                  fontWeight: 800,
                  fontSize: "48px",
                  lineHeight: "39px",
                  textAlign: "center",
                  letterSpacing: "-4px",
                  textTransform: "uppercase",
                  maxWidth: "250px",
                }}
              >
                TEE BOX League
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
              <Link to="/login">
                <Button
                  variant="contained"
                  size="large"
                  sx={{ minWidth: "250px" }}
                >
                  Login
                </Button>
              </Link>
              <div>
                <Typography
                  variant="body1"
                  sx={{
                    maxWidth: "400px",
                    textAlign: "center",
                    margin: "0 auto 5px auto",
                    fontSize: "0.9rem",
                  }}
                >
                  Practice with purpose - Play with an edge
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    maxWidth: "400px",
                    textAlign: "center",
                    margin: "0 auto 20px auto",
                    fontSize: "0.9rem",
                  }}
                >
                  Be a league legend
                </Typography>
                <Link to="/create-account">
                  <Button variant="outlined" color="secondary" size="large">
                    Create an Account
                  </Button>
                </Link>
              </div>
            </Stack>
          </Paper>
        </Container>
      )}
    </React.Fragment>
  );
};

export default observer(Welcome);

import React from "react";
import { observer } from "mobx-react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useUserContext";
import { Button, Stack, Typography } from "@mui/material";

const Welcome: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  return (
    <React.Fragment>
      {user && <Navigate to="/dashboard" state={{ from: location }} replace />}
      {!user && (
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={5}
          sx={{ height: "100%" }}
        >
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
            Tourney Golf
          </Typography>
          <div>
            <Typography variant="h5">
              Take your golf game to the next level.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                maxWidth: "400px",
                textAlign: "center",
                margin: "auto",
              }}
            >
              Track your progress, connect with other players, and master your
              swing with our golf app.
            </Typography>
          </div>
          <Link to="/login">
            <Button variant="contained" size="large" sx={{ minWidth: "250px" }}>
              Login
            </Button>
          </Link>
          <div>
            <Typography variant="body1">
              Join the community and start playing like a pro today.
            </Typography>
            <Link to="/create-account">
              <Button variant="text" color="secondary" size="large">
                Create an Account
              </Button>
            </Link>
          </div>
        </Stack>
      )}
    </React.Fragment>
  );
};

export default observer(Welcome);

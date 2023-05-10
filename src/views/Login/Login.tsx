import React from "react";
import { observer } from "mobx-react";
import UserViewModel from "../../viewModels/UserViewModel";
import LoginForm from "./components/LoginForm/LoginForm";
import { Navigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useUserContext";
import { Button, Stack, Typography } from "@mui/material";

const Login: React.FC = () => {
  const userViewModel = new UserViewModel();
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
          spacing={3}
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
          <LoginForm userViewModel={userViewModel} />
          <div>
            <Typography variant="body1">Don't have an account?</Typography>
            <Link to="/create-account">
              <Button variant="text" size="large">
                Create an Account
              </Button>
            </Link>
          </div>
        </Stack>
      )}
    </React.Fragment>
  );
};

export default observer(Login);

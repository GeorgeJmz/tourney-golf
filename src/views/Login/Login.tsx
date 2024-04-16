import React from "react";
import { observer } from "mobx-react";
import UserViewModel from "../../viewModels/UserViewModel";
import LoginForm from "./components/LoginForm/LoginForm";
import { Navigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useUserContext";
import { Button, Stack, Typography, Paper, Container } from "@mui/material";

const Login: React.FC = () => {
  const userViewModel = new UserViewModel();
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
          <Container
            maxWidth="sm"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              maxWidth: "25vw",
              backdropFilter: "blur(50px)",
              marginBottom: "-50px",
            }}
          >
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={3}
              sx={{ height: "100%" }}
            >
              <img src="logo2.png" width="400" alt="TEE BOX" />
              <Typography
                variant="h3"
                sx={{
                  // fontStyle: "italic",
                  fontWeight: 800,
                  fontSize: "107px",
                  lineHeight: "90px",
                  textAlign: "center",
                  letterSpacing: "-6px",
                  textTransform: "uppercase",
                  // maxWidth: "500px",
                }}
              >
                TEE BOX League
              </Typography>
              <LoginForm userViewModel={userViewModel} />
              <Stack
                direction="column"
                justifyContent="center"
                alignItems="stretch"
                spacing={2}
                sx={{ width: "100%", paddingBottom: "4em" }}
              >
                <Link to="/forgot-password">
                  <Button variant="text" color="secondary" size="large">
                    Forgot your Password
                  </Button>
                </Link>
                {/* <Typography
                  variant="body1"
                  sx={{
                    maxWidth: "400px",
                    textAlign: "center",
                    margin: "20px auto 10px",
                    fontSize: "0.9rem",
                  }}
                >
                  Don't have an account?
                </Typography>
                <Link to="/create-account">
                  <Button variant="outlined" color="secondary" size="large">
                    Create an Account
                  </Button>
                </Link> */}
              </Stack>
            </Stack>
          </Container>
        </Container>
      )}
    </React.Fragment>
  );
};

export default observer(Login);

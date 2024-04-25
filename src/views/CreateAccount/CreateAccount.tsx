import React from "react";
import { observer } from "mobx-react";
import CreateAccountForm from "./components/CreateAccountForm/CreateAccountForm";
import UserViewModel from "../../viewModels/UserViewModel";
import { Navigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useUserContext";
import { Button, Stack, Typography, Paper, Container } from "@mui/material";
import CompositeLogo from "../../components/CompositeLogo";

const CreateAccount: React.FC = () => {
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
          <Paper
            elevation={3}
            sx={{ padding: "2em" }}
          >
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={3}
              sx={{ height: "100%" }}
            >
              {/* <div style={{width: "70%"}}>
                <CompositeLogo mode="vertical"></CompositeLogo>
              </div> */}
              <CreateAccountForm userViewModel={userViewModel} />
              <div>
                <Typography
                  variant="body1"
                  sx={{
                    maxWidth: "400px",
                    textAlign: "center",
                    margin: "20px auto 10px",
                    fontSize: "0.9rem",
                  }}
                >
                  Have an account?
                </Typography>
                <Link to="/login">
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="large"
                    sx={{ minWidth: "250px" }}
                  >
                    Login
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

export default observer(CreateAccount);

import React from "react";
import { observer } from "mobx-react";
import CreateAccountForm from "./components/CreateAccountForm/CreateAccountForm";
import UserViewModel from "../../viewModels/UserViewModel";
import { Navigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useUserContext";
import { Button, Stack, Typography } from "@mui/material";

const CreateAccount: React.FC = () => {
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
                size="large"
                sx={{ minWidth: "250px" }}
              >
                Login
              </Button>
            </Link>
          </div>
        </Stack>
      )}
    </React.Fragment>
  );
};

export default observer(CreateAccount);

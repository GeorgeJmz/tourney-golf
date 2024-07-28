import React from "react";
import UserViewModel from "../../../viewModels/UserViewModel";

import { Navigate, useLocation } from "react-router-dom";
import { observer } from "mobx-react";
import { useAuth } from "../../../hooks/useUserContext";
import { Stack, Box } from "@mui/material";
import NewTheme from "../../../components/NewTheme/NewTheme";
import AccountForm from "./components/AccountForm/AccountForm";
import { URLS } from "../../../helpers/URLS";

export const CreateAccount: React.FC = observer(() => {
  const userViewModel = new UserViewModel();
  const location = useLocation();
  const { user } = useAuth();

  return (
    <React.Fragment>
      {user && (
        <Navigate to={URLS.DASHBOARD} state={{ from: location }} replace />
      )}
      {!user && (
        <NewTheme>
          <Box
            sx={(theme) => ({
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
              paddingX: theme.spacing(3),
            })}
          >
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={3}
              sx={{ height: "100%" }}
            >
              <Box>
                <img
                  src="../L2.jpg"
                  style={{
                    width: "150px",
                  }}
                  alt="TEE BOX"
                />
              </Box>
              <AccountForm userViewModel={userViewModel} />
            </Stack>
          </Box>
        </NewTheme>
      )}
    </React.Fragment>
  );
});

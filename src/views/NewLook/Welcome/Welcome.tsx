import React from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { observer } from "mobx-react";
import { useAuth } from "../../../hooks/useUserContext";
import { Stack, Box, Button } from "@mui/material";
import NewTheme from "../../../components/NewTheme/NewTheme";
import { URLS } from "../../../helpers/URLS";

export const Welcome: React.FC = observer(() => {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <React.Fragment>
      {user && (
        <Navigate to={URLS.DASHBOARD} state={{ from: location }} replace />
      )}
      {!user && (
        <NewTheme hideNav>
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
                    width: "200px",
                  }}
                  alt="TEE BOX"
                />
              </Box>
              <Box>
                <Link to={URLS.LOGIN}>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    sx={{ minWidth: "250px" }}
                  >
                    Login
                  </Button>
                </Link>
              </Box>
              <Box>
                <Link to={URLS.CREATEACCOUNT}>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{ minWidth: "250px" }}
                  >
                    Create an Account
                  </Button>
                </Link>
              </Box>
            </Stack>
          </Box>
        </NewTheme>
      )}
    </React.Fragment>
  );
});

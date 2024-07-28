import React from "react";
import UserViewModel from "../../../viewModels/UserViewModel";
import { observer } from "mobx-react";
import { Box, Stack, Typography } from "@mui/material";
import NewTheme from "../../../components/NewTheme/NewTheme";
import HeaderDashboard from "../../../components/HeaderDashboard/HeaderDashboard";
import { stringName } from "../../../helpers/stringAvatar";
import ProfileForm from "./components/ProfileForm/ProfileForm";

interface IProfileProps {
  user: UserViewModel;
}

export const Profile: React.FC<IProfileProps> = observer(({ user }) => {
  const name = `${user.user.name} ${user.user.lastName}`;
  const initials = stringName(name);
  return (
    <React.Fragment>
      <NewTheme>
        <Box
          sx={(theme) => ({
            display: "flex",
            alignItems: "top",
            justifyContent: "space-around",
            minHeight: "100vh",
            paddingX: theme.spacing(3),
            maxWidth: "1280px",
            margin: "auto",
            marginTop: theme.spacing(6),
          })}
        >
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={3}
            sx={{ height: "100%" }}
          >
            <Box
              display="flex"
              sx={{
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <HeaderDashboard text={initials} />
              <Typography
                sx={(theme) => ({
                  color: theme.palette.primary.main,
                  fontSize: 24,
                  fontWeight: 600,
                })}
              >
                {name}
              </Typography>
            </Box>
            <Box>
              <ProfileForm userViewModel={user} />
            </Box>
            <Box>
              <img
                src="../../logo 3_b.jpg"
                style={{
                  width: "100%",
                  maxWidth: "500px",
                }}
                alt="TEE BOX"
              />
            </Box>
          </Stack>
        </Box>
      </NewTheme>
    </React.Fragment>
  );
});

import React, { useEffect, useMemo } from "react";
import UserViewModel from "../../../viewModels/UserViewModel";
import { observer } from "mobx-react";
import { Stack, Box, Typography, Button } from "@mui/material";
import NewTheme from "../../../components/NewTheme/NewTheme";
import { useParams } from "react-router-dom";
import TournamentViewModel from "../../../viewModels/TournamentViewModel";
import HeaderDashboard from "../../../components/HeaderDashboard/HeaderDashboard";
import { Link } from "react-router-dom";
import { URLS } from "../../../helpers/URLS";
import { convertDate } from "../../../helpers/convertDate";

import { DownloadFileButton } from "../../../components/DownloadFileButton";

interface IRulesProps {
  user: UserViewModel;
}

export const Rules: React.FC<IRulesProps> = observer(({ user }) => {
  const userId = React.useMemo(() => user.getUserId(), []);
  const tournamentViewModel = React.useMemo(
    () => new TournamentViewModel(),
    []
  );
  const { id } = useParams();

  const currentTournament = React.useMemo(
    () => user.activeTournaments.find((t) => t.id === id),
    []
  );
  if (currentTournament && id && tournamentViewModel.author === "") {
    tournamentViewModel.setTournament(currentTournament);
    tournamentViewModel.setTournamentId(id);
    tournamentViewModel.setAuthor(userId);
  }

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
            <HeaderDashboard text={currentTournament?.name || ""} />
            <Box width="100%">
              <Box
                sx={{
                  p: 3,
                  gap: 2,
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <DownloadFileButton
                  pathName={`${currentTournament?.id}/`}
                  fileName="rules"
                />
              </Box>
              <Box
                sx={{
                  p: 3,
                  gap: 2,
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <DownloadFileButton
                  pathName={`${currentTournament?.id}/`}
                  fileName="calendar"
                />
              </Box>
              <Box
                sx={{
                  p: 3,
                  gap: 2,
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <DownloadFileButton
                  pathName={`${currentTournament?.id}/`}
                  fileName="calcutta"
                />
              </Box>
            </Box>
          </Stack>
        </Box>
      </NewTheme>
    </React.Fragment>
  );
});

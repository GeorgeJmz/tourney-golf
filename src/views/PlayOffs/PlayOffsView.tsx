import * as React from "react";
import { observer } from "mobx-react";
import UserViewModel from "../../viewModels/UserViewModel";
import TournamentViewModel from "../../viewModels/TournamentViewModel";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { toJS } from "mobx";
import PlayOffs from "./PlayOffs";

interface IPlayoffsViewProps {
  user: UserViewModel;
}

const PlayoffsView: React.FC<IPlayoffsViewProps> = ({ user }) => {
  const userId = React.useMemo(() => user.getUserId(), []);
  const tournamentViewModel = React.useMemo(() => new TournamentViewModel(), []);
  const { id } = useParams();
  const currentTournament = React.useMemo(
    () =>
      user.activeTournaments.find((t) => t.id === id) ||
      user.historyTournaments.find((t) => t.id === id),
    []
  );

  if (currentTournament && id && tournamentViewModel.author === "") {
    tournamentViewModel.setTournament(currentTournament);
    tournamentViewModel.setTournamentId(id);
    tournamentViewModel.setAuthor(userId);
  }

  React.useEffect(() => {
    if (id) {
      tournamentViewModel.getAllMatchesResultsByTournament();
    }
  }, [id]);

  console.log("PlayoffsView tournamentViewModel", toJS(tournamentViewModel));

  return (
    <Box sx={{ background: "white", p: 3, height: "100vh" }}>
      <PlayOffs tournamentViewModel={tournamentViewModel} readOnly />
    </Box>
  );
};

export default observer(PlayoffsView);



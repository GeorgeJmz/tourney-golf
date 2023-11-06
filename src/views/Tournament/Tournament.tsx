import * as React from "react";
import { observer } from "mobx-react";
import UserViewModel from "../../viewModels/UserViewModel";
import TournamentViewModel from "../../viewModels/TournamentViewModel";
import { Box, Card, CardContent, CardActions, Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useParams } from "react-router-dom";
import { convertDate } from "../../helpers/convertDate";
import { Link } from "react-router-dom";

interface ITournamentPageProps {
  user: UserViewModel;
}

const TournamentPage: React.FC<ITournamentPageProps> = ({ user }) => {
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

  console.log("tournamentViewModel.author", tournamentViewModel);
  console.log(currentTournament, id, tournamentViewModel.author);
  if (currentTournament && id && tournamentViewModel.author === "") {
    tournamentViewModel.setTournament(currentTournament);
    tournamentViewModel.setTournamentId(id);
    tournamentViewModel.setAuthor(userId);
  }

  return (
    <Box sx={{ background: "white", p: 3 }}>
      <Typography gutterBottom align="left" variant="h6" component="div">
        <EmojiEventsIcon /> {currentTournament?.name}
      </Typography>
      <Typography variant="body2" align="left" color="text.secondary">
        {`${convertDate(currentTournament?.startDate || "")} - ${convertDate(
          currentTournament?.cutOffDate || ""
        )}`}
      </Typography>
      <Box sx={{ display: "flex" }}>
        <Link to={`/play-tournament/${id}`}>
          <Button variant="text" color="primary">
            Play
          </Button>
        </Link>
        <Link to={`/stats-tournament/${id}`}>
          <Button
            variant="text"
            color="primary"
            onClick={() => console.log("Ver estadísticas")}
          >
            Board & Stats
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default observer(TournamentPage);

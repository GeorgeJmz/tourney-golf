import * as React from "react";
import { observer } from "mobx-react";
import UserViewModel from "../../viewModels/UserViewModel";
import TournamentViewModel from "../../viewModels/TournamentViewModel";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useParams } from "react-router-dom";
import { convertDate } from "../../helpers/convertDate";
import { Link } from "react-router-dom";
import { DownloadButton } from "../../components/DownloadButton";

interface ITournamentPageProps {
  user: UserViewModel;
}

const TournamentPage: React.FC<ITournamentPageProps> = ({ user }) => {
  const userId = React.useMemo(() => user.getUserId(), []);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
        <Button
          variant="text"
          color="primary"
          disabled
          onClick={() => console.log("Ver Resultados")}
        >
          Results
        </Button>
        <Link to={`/stats-tournament/${id}`}>
          <Button
            variant="text"
            color="primary"
            onClick={() => console.log("Ver estadísticas")}
          >
            Board & Stats
          </Button>
        </Link>
        <Button
          variant="text"
          color="primary"
          disabled
          onClick={() => console.log("Ver estadísticas")}
        >
          Live Scores
        </Button>
        <Button
          variant="text"
          color="primary"
          disabled
          onClick={() => console.log("Ver estadísticas")}
        >
          Playoffs
        </Button>
        <Button variant="text" color="primary" onClick={handleClick}>
          Rules
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem>
            <DownloadButton
              pathName={`${currentTournament?.id}/`}
              fileName="rules"
            />
          </MenuItem>
          <MenuItem>
            <DownloadButton
              pathName={`${currentTournament?.id}/`}
              fileName="calendar"
            />
          </MenuItem>
          <MenuItem>
            <DownloadButton
              pathName={`${currentTournament?.id}/`}
              fileName="additional files"
            />
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default observer(TournamentPage);

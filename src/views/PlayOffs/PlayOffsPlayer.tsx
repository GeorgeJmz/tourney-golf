import * as React from "react";
import { observer } from "mobx-react";
import UserViewModel from "../../viewModels/UserViewModel";
import TournamentViewModel from "../../viewModels/TournamentViewModel";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Menu,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useParams } from "react-router-dom";
import { convertMomentDate, differenceDate } from "../../helpers/convertDate";

import MenuItems from "../../components/MenuItems";
import HorizontalScoreCard from "../Play/components/HorizontalScoreCard";
import MatchViewModel from "../../viewModels/MatchViewModel";
import { set, toJS } from "mobx";
import PlayOffs from "./PlayOffs";

interface IPlayoffsPlayerProps {
  user: UserViewModel;
}

const PlayoffsPlayer: React.FC<IPlayoffsPlayerProps> = ({ user }) => {
  const userId = React.useMemo(() => user.getUserId(), []);

  const [userStats, setUserStats] = React.useState("");

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

  const isMobile = () =>
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  return (
    <Box sx={{ background: "white", p: 3, height: "100vh" }}>
      <PlayOffs tournamentViewModel={tournamentViewModel} isPlayer />
    </Box>
  );
};

export default observer(PlayoffsPlayer);

import * as React from "react";
import { observer } from "mobx-react";
import UserViewModel from "../../viewModels/UserViewModel";
import TournamentViewModel from "../../viewModels/TournamentViewModel";
import {
  Box,
  Button,
  ButtonGroup,
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
import Typography from "@mui/material/Typography";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useParams } from "react-router-dom";
import MenuItems from "../../components/MenuItems";
import { toJS } from "mobx";
import { DownloadButton } from "../../components/DownloadButton";

interface IRulesProps {
  user: UserViewModel;
}

const Rules: React.FC<IRulesProps> = ({ user }) => {
  const tournamentViewModel = React.useMemo(
    () => new TournamentViewModel(),
    []
  );
  const { id } = useParams();
  const currentTournament = React.useMemo(
    () => user.activeTournaments.find((t) => t.id === id),
    []
  );

  React.useEffect(() => {
    if (id) {
      tournamentViewModel.setTournamentId(id);
    }
  }, [id]);

  return (
    <Box sx={{ background: "white", p: 3, height: "100vh" }}>
      <div>
        <Box
          sx={{
            background: "white",
            p: 3,
            gap: 2,
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <DownloadButton
            pathName={`${currentTournament?.id}/`}
            fileName="rules"
          />
        </Box>
        <Box
          sx={{
            background: "white",
            p: 3,
            gap: 2,
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <DownloadButton
            pathName={`${currentTournament?.id}/`}
            fileName="calendar"
          />
        </Box>
        <Box
          sx={{
            background: "white",
            p: 3,
            gap: 2,
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <DownloadButton
            pathName={`${currentTournament?.id}/`}
            fileName="calcutta"
          />
        </Box>
      </div>
    </Box>
  );
};

export default observer(Rules);

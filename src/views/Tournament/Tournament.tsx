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
  Grid,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useParams } from "react-router-dom";
import { convertDate } from "../../helpers/convertDate";
import { Link } from "react-router-dom";
import { DownloadButton } from "../../components/DownloadButton";
import { NavbarTitleContext } from "../../hooks/useNavContext";

interface ITournamentPageProps {
  user: UserViewModel;
}

const TournamentPage: React.FC<ITournamentPageProps> = ({ user }) => {
  const userId = React.useMemo(() => user.getUserId(), []);
  const { setTitle } = React.useContext(NavbarTitleContext);

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

  if (currentTournament && id && tournamentViewModel.author === "") {
    tournamentViewModel.setTournament(currentTournament);
    tournamentViewModel.setTournamentId(id);
    tournamentViewModel.setAuthor(userId);
  }

  React.useEffect(() => {
    setTitle(currentTournament?.name || "");
  }, [currentTournament?.name]);

  const isActiveTournament = React.useMemo(() => {
    const endDate = convertDate(
      currentTournament?.cutOffDate || "",
      "MM/DD/YYYY"
    );
    const today = convertDate(new Date().toISOString(), "MM/DD/YYYY");

    const compareDates = (d1: string, d2: string) => {
      const date1 = new Date(d1).getTime();
      const date2 = new Date(d2).getTime();
      if (date1 < date2) {
        return false;
        //console.log(`${d1} is less than ${d2}`);
      } else if (date1 > date2) {
        return true;
        //console.log(`${d1} is greater than ${d2}`);
      } else {
        return true;
      }
    };

    return compareDates(endDate, today);
  }, [currentTournament?.cutOffDate]);
  return (
    <Box sx={{ height: "100vh" }}>
      <Grid container spacing={2} sx={{ p: 3 }}>
        <Grid item md={2} xs={12}>
          {isActiveTournament ? (
            <Link to={`/play-tournament/${id}`}>
              <Button variant="text" color="primary">
                Play
              </Button>
            </Link>
          ) : (
            <Button variant="text" disabled color="primary">
              Play
            </Button>
          )}
        </Grid>
        <Grid item md={2} xs={12}>
          <Link to={`/results/${id}`}>
            <Button
              variant="text"
              color="primary"
              onClick={() => console.log("Ver Resultados")}
            >
              Results
            </Button>
          </Link>
        </Grid>
        <Grid item md={2} xs={12}>
          <Link to={`/stats-tournament/${id}`}>
            <Button
              variant="text"
              color="primary"
              onClick={() => console.log("Ver estadísticas")}
            >
              Board & Stats
            </Button>
          </Link>
        </Grid>
        {/* <Grid item md={2} xs={12}>
          <Button
            variant="text"
            color="primary"
            disabled
            onClick={() => console.log("Ver estadísticas")}
          >
            Live Scores
          </Button>
        </Grid> */}
        <Grid item md={2} xs={12}>
          <Button
            variant="text"
            color="primary"
            disabled
            onClick={() => console.log("Ver estadísticas")}
          >
            Playoffs
          </Button>
        </Grid>
        <Grid item md={2} xs={12}>
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
                fileName="calcutta"
              />
            </MenuItem>
          </Menu>
        </Grid>
      </Grid>
    </Box>
  );
};

export default observer(TournamentPage);

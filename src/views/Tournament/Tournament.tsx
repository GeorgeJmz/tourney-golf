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
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import Looks3Icon from "@mui/icons-material/Looks3";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
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
    tournamentViewModel.getStatsPlayersByTournament();
    console.log("TournamentPage currentTournament", currentTournament);
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

  const standings = [
    tournamentViewModel.statsPlayers[0] ?? [],
    tournamentViewModel.statsPlayers[1] ?? [],
    tournamentViewModel.statsPlayers[2] ?? [],
  ];
  const icons = [<LooksOneIcon />, <LooksTwoIcon />, <Looks3Icon />];

  const isMobile = () =>
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  const getStandings = () => (
    <Box>
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          pt: 2,
        }}
      >
        STANDINGS
      </Typography>
      <Box
        justifyContent="center"
        alignItems="center"
        display="flex"
        flexDirection={isMobile() ? "column" : "row"}
      >
        {standings.map((player, index) => (
          <List sx={{ minWidth: "200px", bgcolor: "background.paper" }}>
            <ListItem key={player.tourneyName}>
              <ListItemAvatar>
                <Avatar
                  sx={(theme) => ({
                    backgroundColor: theme.palette.primary.main,
                  })}
                >
                  {icons[index]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <p
                    style={{
                      fontSize: "1.5em",
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    {player.tourneyName} - <strong>{player.totalPoints}</strong>
                  </p>
                }
              />
            </ListItem>
          </List>
        ))}
      </Box>
    </Box>
  );

  const getMenu = () => (
    <Box
      justifyContent="center"
      alignItems="center"
      gap="32px"
      display="flex"
      flexWrap="wrap"
      sx={{
        p: 2,
      }}
    >
      <Box flexBasis={isMobile() ? "50%" : "10%"}>
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
      </Box>
      <Box flexBasis={isMobile() ? "50%" : "10%"}>
        <Link to={`/results/${id}`}>
          <Button
            variant="text"
            color="primary"
            onClick={() => console.log("Ver Resultados")}
          >
            Results
          </Button>
        </Link>
      </Box>
      <Box flexBasis={isMobile() ? "50%" : "15%"}>
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
      <Box flexBasis={isMobile() ? "50%" : "10%"}>
        <Button
          variant="text"
          color="primary"
          disabled
          onClick={() => console.log("Ver estadísticas")}
        >
          Playoffs
        </Button>
      </Box>
      <Box flexBasis={isMobile() ? "50%" : "10%"}>
        <Link to={`/rules-tournament/${id}`}>
          <Button
            variant="text"
            color="primary"
            onClick={() => console.log("Ver estadísticas")}
          >
            Rules
          </Button>
        </Link>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ height: "100vh", background: "white" }}>
      {isMobile() ? [getStandings(), getMenu()] : [getMenu(), getStandings()]}
    </Box>
  );
};

export default observer(TournamentPage);

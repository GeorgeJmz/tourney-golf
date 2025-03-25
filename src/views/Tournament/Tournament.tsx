import React, { useMemo, useContext, memo } from "react";
import { observer } from "mobx-react";
import UserViewModel from "../../viewModels/UserViewModel";
import TournamentViewModel from "../../viewModels/TournamentViewModel";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Skeleton,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { convertDate } from "../../helpers/convertDate";
import { NavbarTitleContext } from "../../hooks/useNavContext";
import TeamBoard from "../TournamentStats/TeamBoard";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import Looks3Icon from "@mui/icons-material/Looks3";
import { useGetStandings } from "../../hooks/useGetStandings";
import { toJS } from "mobx";

interface ITournamentPageProps {
  user: UserViewModel;
}

// Subcomponente para el Menú
export const TournamentMenu = memo(
  ({
    isMobile,
    isActiveTournament,
    isDogfight,
    isTeamPlay,
    isLeagueTeamPlay,
    id,
  }: {
    isMobile: boolean;
    isActiveTournament: boolean;
    isDogfight: boolean;
    isTeamPlay: boolean;
    isLeagueTeamPlay: boolean;
    id: string;
  }) => {
    const getLinkPath = (basePath: string) => {
      return isDogfight
        ? `${basePath}-dogfight/${id}`
        : isTeamPlay
        ? `${basePath}-team/${id}`
        : `${basePath}/${id}`;
    };

    return (
      <Box
        justifyContent="center"
        alignItems="center"
        gap="32px"
        display="flex"
        flexWrap="wrap"
        sx={{ p: 2 }}
      >
        <Box flexBasis={isMobile ? "50%" : "10%"}>
          <Link to={isActiveTournament ? getLinkPath("/play-tournament") : "#"}>
            <Button
              variant="text"
              color="primary"
              disabled={!isActiveTournament}
            >
              Play
            </Button>
          </Link>
        </Box>
        {!isDogfight && !isTeamPlay && (
          <Box flexBasis={isMobile ? "50%" : "10%"}>
            <Link to={`/stats/${id}`}>
              <Button variant="text" color="primary">
                Stats
              </Button>
            </Link>
          </Box>
        )}
        {!isTeamPlay && (
          <Box flexBasis={isMobile ? "50%" : "15%"}>
            <Link to={getLinkPath("/stats-tournament")}>
              <Button variant="text" color="primary">
                Board
              </Button>
            </Link>
          </Box>
        )}
        <Box flexBasis={isMobile ? "50%" : "10%"}>
          <Link to={getLinkPath("/results")}>
            <Button variant="text" color="primary">
              Results
            </Button>
          </Link>
        </Box>
        {(isTeamPlay || isLeagueTeamPlay) && (
          <>
            <Box flexBasis={isMobile ? "50%" : "10%"}>
              <Link to={`/team-board/${id}`}>
                <Button variant="text" color="primary">
                  {isLeagueTeamPlay ? "Team" : "Team Board"}
                </Button>
              </Link>
            </Box>
            <Box flexBasis={isMobile ? "50%" : "10%"}>
              <Link to={`/player-board/${id}`}>
                <Button variant="text" color="primary">
                  {isLeagueTeamPlay ? "Player" : "Player Board"}
                </Button>
              </Link>
            </Box>
          </>
        )}
        <Box flexBasis={isMobile ? "50%" : "10%"}>
          <Link to={`/rules-tournament/${id}`}>
            <Button variant="text" color="primary">
              Rules
            </Button>
          </Link>
        </Box>
      </Box>
    );
  }
);

const TournamentPage: React.FC<ITournamentPageProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const userId = useMemo(() => user.getUserId(), [user]);
  const { setTitle } = useContext(NavbarTitleContext);
  const tournamentViewModel = useMemo(() => new TournamentViewModel(), []);
  const currentTournament = useMemo(
    () => user.activeTournaments.find((t) => t.id === id),
    [user.activeTournaments, id]
  );

  const tournamentType = currentTournament?.tournamentType;
  const isDogfight = tournamentType === "dogfight";
  const isTeamPlay = tournamentType === "teamplay";
  const isLeagueTeamPlay = tournamentType === "leagueteamplay";
  const { isFetching, data } = useGetStandings(
    currentTournament?.id || "",
    tournamentViewModel
  );
  useMemo(() => {
    if (currentTournament && id && tournamentViewModel.author === "") {
      tournamentViewModel.setTournament(currentTournament);
      tournamentViewModel.setTournamentId(id);
      tournamentViewModel.setAuthor(userId);
      console.log("TournamentPage: ", currentTournament);
      console.log(toJS(tournamentViewModel.standings));
      //tournamentViewModel.getStatsPlayersByTournament();
    }
    if (data?.data.standings && tournamentViewModel.standings.length === 0) {
      tournamentViewModel.setStandingsBytTournament(data?.data.standings);
    }
  }, [
    currentTournament,
    id,
    tournamentViewModel,
    userId,
    data?.data.standings,
  ]);

  React.useEffect(() => {
    setTitle(currentTournament?.name || "");
  }, [currentTournament?.name, setTitle]);

  const isActiveTournament = useMemo(() => {
    if (!currentTournament) {
      return false;
    }
    const endDate = convertDate(
      currentTournament.cutOffDate || "",
      "MM/DD/YYYY"
    );
    const today = convertDate(new Date().toISOString(), "MM/DD/YYYY");
    const compareDates = (d1: string, d2: string) =>
      new Date(d1) >= new Date(d2);
    return compareDates(endDate, today);
  }, [currentTournament]);

  const icons = [<LooksOneIcon />, <LooksTwoIcon />, <Looks3Icon />];

  const isMobile = useMemo(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }, []);

  const getStandings = () => (
    <Box>
      {isFetching && (
        <Box flex={1} display="flex" justifyContent="center">
          <Skeleton variant="text" animation="wave" height={40} width={100} />
        </Box>
      )}
      {!isFetching && (
        <Typography variant="h6" sx={{ fontWeight: "bold", pt: 2 }}>
          STANDINGS
        </Typography>
      )}
      <Box
        justifyContent="center"
        alignItems="center"
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
      >
        {isFetching && (
          <>
            <List
              sx={{
                minWidth: "200px",
                padding: "10px",
                bgcolor: "background.paper",
              }}
            >
              <Skeleton variant="rounded" animation="wave" height={40} />
            </List>
            <List
              sx={{
                minWidth: "200px",
                padding: "10px",
                bgcolor: "background.paper",
              }}
            >
              <Skeleton variant="rounded" animation="wave" height={40} />
            </List>
            <List
              sx={{
                minWidth: "200px",
                padding: "10px",
                bgcolor: "background.paper",
              }}
            >
              <Skeleton variant="rounded" animation="wave" height={40} />
            </List>
          </>
        )}
        {isTeamPlay && <TeamBoard user={user} isSmall />}
        {!isTeamPlay &&
          tournamentViewModel.standings.map((player, index) => (
            <List
              key={player.name}
              sx={{ minWidth: "200px", bgcolor: "background.paper" }}
            >
              <ListItem>
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
                    <p style={{ fontSize: "1.5em", margin: 0, padding: 0 }}>
                      {player.name} - <strong>{player.points}</strong>
                    </p>
                  }
                />
              </ListItem>
            </List>
          ))}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ height: "100vh", background: "white" }}>
      {isMobile
        ? [
            getStandings(),
            <TournamentMenu
              key="menu"
              {...{
                isMobile,
                isActiveTournament,
                isDogfight,
                isTeamPlay,
                isLeagueTeamPlay,
                id: id || "",
              }}
            />,
          ]
        : [
            <TournamentMenu
              key="menu"
              {...{
                isMobile,
                isActiveTournament,
                isDogfight,
                isTeamPlay,
                isLeagueTeamPlay,
                id: id || "",
              }}
            />,
            getStandings(),
          ]}
    </Box>
  );
};

export default observer(TournamentPage);

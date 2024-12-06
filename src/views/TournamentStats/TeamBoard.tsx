import * as React from "react";
import { observer } from "mobx-react";
import UserViewModel from "../../viewModels/UserViewModel";
import TournamentViewModel from "../../viewModels/TournamentViewModel";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
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
import { set, toJS } from "mobx";
import { convertDate } from "../../helpers/convertDate";
import { ITournamentPlayer } from "../../models/Player";

import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import Looks3Icon from "@mui/icons-material/Looks3";

interface ITeamBoardProps {
  user: UserViewModel;
  isSmall?: boolean;
}

const TeamBoard: React.FC<ITeamBoardProps> = ({ user, isSmall }) => {
  const userId = React.useMemo(() => user.getUserId(), []);
  const [stats, setStats] = React.useState("");

  const [dateRange, setDateRange] = React.useState({
    start: "",
    end: "",
  });

  const [teamsToDisplay, setTeamsToDisplay] = React.useState<
    Array<{
      name: string;
      playersNames: string;
      pointsPerPlayer: string;
      roundsPlayed: number;
      points: number;
    }>
  >([]);

  const tournamentViewModel = React.useMemo(
    () => new TournamentViewModel(),
    []
  );
  const { id } = useParams();
  const assignCurrentStage = () => {
    const currentDate = convertDate(
      new Date().toDateString() || "",
      "MM/DD/YYYY"
    );

    currentTournament?.stagesDates?.forEach((date, index) => {
      const startDate = convertDate(date.start, "MM/DD/YYYY");
      const endDate = convertDate(date.end, "MM/DD/YYYY");

      if (currentDate >= startDate && currentDate <= endDate) {
        setStats(index.toString());
        setDateRange({
          start: startDate,
          end: endDate,
        });
      }
    });

    if (
      currentTournament?.championshipDate &&
      convertDate(currentTournament?.championshipDate, "MM/DD/YYYY") ==
        currentDate
    ) {
      setStats("champ");
      setDateRange({
        start: currentDate,
        end: currentDate,
      });
    }

    console.log("currentDate", currentDate);
  };
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
      tournamentViewModel.setTournamentId(id);
      tournamentViewModel.getTeamStatsPlayersByTournament();
      setTimeout(() => {
        assignCurrentStage();
      }, 1);
    }
  }, [id]);

  React.useEffect(() => {
    console.log(
      "tournamentViewModel.statsTeams",
      toJS(tournamentViewModel.fullStatsTeams)
    );
    const teams = tournamentViewModel.fullStatsTeams;
    const finalTeams = [];
    for (const team in teams) {
      const dates = Array.from({
        length: tournamentViewModel.tournament.numberOfStages,
      }).map((_, index) => {
        return {
          start: convertDate(
            tournamentViewModel.tournament.stagesDates[index].start,
            "MM/DD/YYYY"
          ),
          end: convertDate(
            tournamentViewModel.tournament.stagesDates[index].end,
            "MM/DD/YYYY"
          ),
        };
      });
      const teamName =
        tournamentViewModel.tournament.teamsList.find((t) => t.id === team)
          ?.name || "";
      const roundsPlayed = teams[team].reduce(
        (acc, curr) => acc + curr.pointsTeam.length,
        0
      );
      const points = teams[team].reduce(
        (acc, curr) =>
          acc +
          curr.pointsTeam.reduce((a, c, index) => {
            const matchDate = curr.date?.[index] ?? "";
            if (matchDate >= dateRange.start && matchDate <= dateRange.end) {
              return a > c ? a : c;
            }
            return a;
          }, 0),
        0
      );

      const getPointsTopStagePerPlayer = (player: ITournamentPlayer) => {
        const getPointsPerState = dates
          .map((date) => {
            return player.pointsTeam.reduce<Array<number>>(
              (acc, curr, index) => {
                const matchDate = player.date?.[index] ?? "";
                if (matchDate >= date.start && matchDate <= date.end) {
                  return [...acc, curr];
                }
                return acc;
              },
              []
            );
          })
          .flat();

        console.log("getPointsPerState", getPointsPerState);
        const topStage = `${getPointsPerState.reduce(
          (acc, curr) => (acc > curr ? acc : curr),
          0
        )}`;
        return topStage;
      };

      const getPointsPerPlayer = (player: ITournamentPlayer) => {
        return player.pointsTeam.reduce((acc, curr, index) => {
          const matchDate = player.date?.[index] ?? "";
          if (matchDate >= dateRange.start && matchDate <= dateRange.end) {
            return acc > curr ? acc : curr;
          }
          return acc;
        }, 0);
      };
      console.log(toJS(teams[team]), "teams[team]");
      const getOrderedPlayers = () => {
        const teamsSortedByChamp = [...teams[team]].sort((a, b) => {
          const champPoints = getPointsPerPlayer(a);
          const champPointsB = getPointsPerPlayer(b);
          if (champPointsB === champPoints) {
            const topStageA = getPointsTopStagePerPlayer(a);
            const topStageB = getPointsTopStagePerPlayer(b);
            return Number(topStageB) - Number(topStageA);
          }
          return champPointsB - champPoints;
        });
        return teamsSortedByChamp;
      };

      const teamSorted =
        stats === "champ" ? getOrderedPlayers().slice(0, 2) : teams[team];

      const newTeam = {
        name: teamName,
        playersNames: teamSorted.map((player) => player.name).join(" | "),
        pointsPerPlayer: teamSorted
          .map((player) =>
            stats === "champ"
              ? `${getPointsTopStagePerPlayer(player)} | ${getPointsPerPlayer(
                  player
                )}`
              : getPointsPerPlayer(player)
          )
          .join(", "),
        roundsPlayed,
        points:
          stats === "champ"
            ? teamSorted.reduce(
                (acc, next) =>
                  parseInt(getPointsTopStagePerPlayer(next).toString()) +
                  parseInt(getPointsPerPlayer(next).toString()) +
                  acc,
                0
              )
            : points,
      };
      finalTeams.push(newTeam);
    }
    setTeamsToDisplay(finalTeams.sort((a, b) => b.points - a.points));
    console.log("finalTeams", finalTeams);
  }, [dateRange, tournamentViewModel.fullStatsTeams]);

  const tournamentType = tournamentViewModel.tournament.tournamentType;
  const playType = tournamentViewModel.tournament.playType;

  const showTeams =
    tournamentType === "leagueteamplay" || tournamentType === "teamplay";
  const showMatch = playType !== "strokePlay";
  const showMedal = playType !== "matchPlay";

  const hStyles = {
    textAlign: "center",
    filter: "drop-shadow(7px 7px 11px grey)",
    position: "sticky",
    top: 0,
    backgroundColor: "rgb(118, 118, 118);",
    color: "white",
    fontWeight: "bold",
    border: "none",
    width: 80,
    zIndex: 1,
  };

  const tableRowsTeams = teamsToDisplay.map((t, i) => (
    <TableRow key={t.name}>
      <TableCell sx={{ textAlign: "center" }}>
        {t.name} <br /> {t.playersNames}
      </TableCell>
      <TableCell sx={{ textAlign: "center" }}>{t.points}</TableCell>
      <TableCell sx={{ textAlign: "center" }}>{t.pointsPerPlayer}</TableCell>
    </TableRow>
  ));

  const tableRowsChamp = teamsToDisplay.map((t, i) => (
    <TableRow key={t.name}>
      <TableCell sx={{ textAlign: "center" }}>
        {t.name} <br /> {t.playersNames}
      </TableCell>
      <TableCell sx={{ textAlign: "center" }}>{t.points}</TableCell>
      <TableCell sx={{ textAlign: "center" }}>{t.pointsPerPlayer}</TableCell>
    </TableRow>
  ));

  const tableRowsHeaders = (
    <TableRow>
      <TableCell sx={{ textAlign: "center" }}> Team </TableCell>
      <TableCell sx={{ textAlign: "center" }}> Total </TableCell>
      <TableCell sx={{ textAlign: "center" }}>
        {stats === "champ" ? "Top | Champ" : "Points"}
      </TableCell>
    </TableRow>
  );

  const stagesButtons = Array.from({
    length: tournamentViewModel.tournament.numberOfStages,
  }).map((_, index) => (
    <Button
      key={index}
      variant={stats === index.toString() ? "contained" : "outlined"}
      onClick={() => {
        setStats(index.toString());
        setDateRange({
          start: convertDate(
            tournamentViewModel.tournament.stagesDates[index].start,
            "MM/DD/YYYY"
          ),
          end: convertDate(
            tournamentViewModel.tournament.stagesDates[index].end,
            "MM/DD/YYYY"
          ),
        });
      }}
    >
      Stage {index + 1}
    </Button>
  ));
  const icons = [<LooksOneIcon />, <LooksTwoIcon />, <Looks3Icon />];
  return isSmall ? (
    <>
      {teamsToDisplay
        .filter((team, i) => i < 3)
        .map((t, i) => (
          <List sx={{ minWidth: "200px", bgcolor: "background.paper" }}>
            <ListItem key={t.name}>
              <ListItemAvatar>
                <Avatar
                  sx={(theme) => ({
                    backgroundColor: theme.palette.primary.main,
                  })}
                >
                  {icons[i]}
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
                    {t.name} - <strong>{t.points}</strong>
                  </p>
                }
              />
            </ListItem>
          </List>
        ))}
    </>
  ) : (
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
          {stagesButtons.map((button) => button)}
          <Button
            variant={stats === "champ" ? "contained" : "outlined"}
            key="champ"
            onClick={() => {
              setStats("champ");
              setDateRange({
                start: convertDate(
                  currentTournament?.championshipDate || "",
                  "MM/DD/YYYY"
                ),
                end: convertDate(
                  currentTournament?.championshipDate || "",
                  "MM/DD/YYYY"
                ),
              });
            }}
          >
            Champ
          </Button>
        </Box>
      </div>

      <div>
        {dateRange.start} - {dateRange.end}
      </div>

      <TableContainer component={Box}>
        <Table>
          <TableHead>{tableRowsHeaders}</TableHead>
          <TableBody>{tableRowsTeams}</TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default observer(TeamBoard);

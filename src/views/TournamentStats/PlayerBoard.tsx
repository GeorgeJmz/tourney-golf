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
import { set, toJS } from "mobx";
import { convertDate } from "../../helpers/convertDate";
import { ITournamentPlayer } from "../../models/Player";

interface IPlayerBoardProps {
  user: UserViewModel;
}

const PlayerBoard: React.FC<IPlayerBoardProps> = ({ user }) => {
  const userId = React.useMemo(() => user.getUserId(), []);
  const [stats, setStats] = React.useState("");

  const [dateRange, setDateRange] = React.useState({
    start: "",
    end: "",
  });

  const [teamsToDisplay, setTeamsToDisplay] = React.useState<
    Array<{
      player: string;
      top: string;
      pointsPerStage: string;
      total: string;
      topStage: string;
      champ: string;
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
      const getPointsPerPlayer = (player: ITournamentPlayer) => {
        return player.pointsTeam.reduce((acc, curr, index) => {
          const matchDate = player.date?.[index] ?? "";
          if (matchDate >= dateRange.start && matchDate <= dateRange.end) {
            return acc > curr ? acc : curr;
          }
          return acc;
        }, 0);
      };
      const getPointsPerPlayerPerStage = (player: ITournamentPlayer) => {
        return player.pointsTeam.reduce((acc, curr, index) => {
          const matchDate = player.date?.[index] ?? "";
          if (matchDate >= dateRange.start && matchDate <= dateRange.end) {
            return acc !== "-" ? `${acc} | ${curr}` : `${curr}`;
          }
          return acc;
        }, "-");
      };
      console.log(toJS(teams[team]), "teams[team]");

      const getTotalStages = (player: ITournamentPlayer) => {
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
        const getTotalPointsPerStage = dates.map((date) => {
          return player.pointsTeam.reduce((acc, curr, index) => {
            const matchDate = player.date?.[index] ?? "";
            if (matchDate >= date.start && matchDate <= date.end) {
              return acc + curr;
            }
            return acc;
          }, 0);
        });

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
        const champPoints = getPointsPerPlayerPerStage(player);
        const total =
          champPoints !== "-"
            ? `${parseInt(topStage) + parseInt(champPoints)}`
            : `${parseInt(topStage)}`;
        console.log("getTotalPointsPerStage", getTotalPointsPerStage);
        return {
          champ: champPoints,
          total,
          topStage,
        };
      };

      const players = teams[team].map((player) => {
        const { total, topStage, champ } =
          stats === "champ"
            ? getTotalStages(player)
            : { total: "0", topStage: "0", champ: "0" };
        return {
          player: player.name,
          top: stats === "champ" ? "0" : getPointsPerPlayer(player),
          pointsPerStage:
            stats === "champ" ? "0" : getPointsPerPlayerPerStage(player),
          total,
          topStage,
          champ,
        };
      });

      finalTeams.push(players);
    }
    const ttd = finalTeams
      .flat()
      .sort((a, b) => parseInt(b.top.toString()) - parseInt(a.top.toString()))
      .map((team) => ({
        ...team,
        top: team.top.toString(),
      }));
    setTeamsToDisplay(ttd);
  }, [dateRange, tournamentViewModel.fullStatsTeams]);

  const champTableHeader = () => (
    <TableRow>
      <TableCell sx={{ textAlign: "center" }}> </TableCell>
      <TableCell sx={{ textAlign: "center" }}> Name </TableCell>
      <TableCell sx={{ textAlign: "center" }}> Total </TableCell>
      <TableCell sx={{ textAlign: "center" }}>Top Stage</TableCell>
      <TableCell sx={{ textAlign: "center" }}>Champ</TableCell>
    </TableRow>
  );

  const stageTableHeader = () => (
    <TableRow>
      <TableCell sx={{ textAlign: "center" }}> </TableCell>
      <TableCell sx={{ textAlign: "center" }}> Name </TableCell>
      <TableCell sx={{ textAlign: "center" }}> Top </TableCell>
      <TableCell sx={{ textAlign: "center" }}>Points</TableCell>
    </TableRow>
  );

  const champTableRows = () =>
    teamsToDisplay
      .sort(
        (a, b) => parseInt(b.total.toString()) - parseInt(a.total.toString())
      )
      .map((t, i) => (
        <TableRow key={t.player}>
          <TableCell sx={{ textAlign: "center" }}>{i + 1} </TableCell>
          <TableCell sx={{ textAlign: "center" }}>
            {t.player} <br />
          </TableCell>
          <TableCell sx={{ textAlign: "center" }}>
            {parseInt(t.total) > 0 ? t.total : " - "}
          </TableCell>
          <TableCell sx={{ textAlign: "center" }}>
            {parseInt(t.topStage) > 0 ? t.topStage : " - "}
          </TableCell>
          <TableCell sx={{ textAlign: "center" }}>
            {parseInt(t.champ) > 0 ? t.champ : " - "}
          </TableCell>
        </TableRow>
      ));

  const stageTableRows = () =>
    teamsToDisplay.map((t, i) => (
      <TableRow key={t.player}>
        <TableCell sx={{ textAlign: "center" }}>{i + 1} </TableCell>
        <TableCell sx={{ textAlign: "center" }}>
          {t.player} <br />
        </TableCell>
        <TableCell sx={{ textAlign: "center" }}>
          {parseInt(t.top) > 0 ? t.top : " - "}
        </TableCell>
        <TableCell sx={{ textAlign: "center" }}>{t.pointsPerStage}</TableCell>
      </TableRow>
    ));

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
          <TableHead>
            {stats === "champ" ? champTableHeader() : stageTableHeader()}
          </TableHead>
          <TableBody>
            {stats === "champ" ? champTableRows() : stageTableRows()}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default observer(PlayerBoard);

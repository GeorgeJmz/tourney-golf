import * as React from "react";
import { observer } from "mobx-react";
import UserViewModel from "../../viewModels/UserViewModel";
import TournamentViewModel from "../../viewModels/TournamentViewModel";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import { toJS } from "mobx";
import { convertDate } from "../../helpers/convertDate";
import { ITournamentPlayer } from "../../models/Player";
import { IMatch } from "../../models/Match";
import { getMatchesByTournamentId } from "../../services/firebase";

interface IDerbyBoardProps {
  user: UserViewModel;
}

const DerbyBoard: React.FC<IDerbyBoardProps> = ({ user }) => {
  const userId = React.useMemo(() => user.getUserId(), []);
  const [selectedRound, setSelectedRound] = React.useState("");

  const [dateRange, setDateRange] = React.useState({
    start: "",
    end: "",
  });

  const [matches, setMatches] = React.useState<IMatch[]>([]);

  const [playersToDisplay, setPlayersToDisplay] = React.useState<
    Array<{
      player: string;
      bestNet: number;
      netScores: string;
      totalNet: number;
      handicap: number;
      course: string;
      // Para Championship - scores por stage
      stageScores?: number[];
      champScore?: number;
      champW?: number;
    }>
  >([]);

  const tournamentViewModel = React.useMemo(
    () => new TournamentViewModel(),
    []
  );
  const { id } = useParams();

  const assignCurrentRound = () => {
    const currentDate = convertDate(
      new Date().toDateString() || "",
      "MM/DD/YYYY"
    );

    // Verificar stages - usar roundDates o stagesDates del torneo o viewModel
    const tournamentRef = currentTournament || tournamentViewModel.tournament;
    const rounds = (tournamentRef?.roundDates || tournamentRef?.stagesDates) as unknown as {
      start: string;
      end: string;
    }[] || [];

    rounds?.forEach((date, index) => {
      const startDate = convertDate(date.start, "MM/DD/YYYY");
      const endDate = convertDate(date.end, "MM/DD/YYYY");

      if (currentDate >= startDate && currentDate <= endDate) {
        setSelectedRound(index.toString());
        setDateRange({
          start: startDate,
          end: endDate,
        });
      }
    });

    // Verificar Championship Round
    const tournament = currentTournament || tournamentViewModel.tournament;
    if (
      tournament?.championshipRound &&
      tournament?.championshipDate &&
      convertDate(tournament?.championshipDate, "MM/DD/YYYY") ===
        currentDate
    ) {
      setSelectedRound("champ");
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
      // Cargar matches para obtener course info
      getMatchesByTournamentId(id).then((matchesData) => {
        setMatches(matchesData);
      });
      setTimeout(() => {
        assignCurrentRound();
      }, 1);
    }
  }, [id]);

  React.useEffect(() => {
    console.log(
      "tournamentViewModel.fullStatsTeams",
      toJS(tournamentViewModel.fullStatsTeams)
    );
    const teams = tournamentViewModel.fullStatsTeams;
    const finalPlayers = [];

    // Crear un mapa de scoreId -> match para acceso rápido
    const scoreIdToMatch = new Map<string, IMatch>();
    matches.forEach((match) => {
      match.scoresId?.forEach((scoreId) => {
        if (scoreId) {
          scoreIdToMatch.set(scoreId, match);
        }
      });
    });

    for (const team in teams) {
      // Obtener índices de scores dentro del rango de fechas
      const getScoreIndicesInRange = (player: ITournamentPlayer) => {
        const indices: number[] = [];
        player.net.forEach((_, index) => {
          const matchDate = player.date?.[index] ?? "";
          if (matchDate >= dateRange.start && matchDate <= dateRange.end) {
            indices.push(index);
          }
        });
        return indices;
      };

      // Obtener los net scores dentro del rango de fechas (considerando handicap)
      const getNetScoresInRange = (player: ITournamentPlayer) => {
        const scores: number[] = [];
        player.net.forEach((net, index) => {
          const matchDate = player.date?.[index] ?? "";
          if (matchDate >= dateRange.start && matchDate <= dateRange.end) {
            scores.push(net);
          }
        });
        return scores;
      };

      // Obtener el mejor net (menor score) del round y su índice
      const getBestNetInRound = (player: ITournamentPlayer) => {
        const indices = getScoreIndicesInRange(player);
        if (indices.length === 0) {
          return { bestNet: 0, bestIndex: -1 };
        }
        
        let bestNet = Infinity;
        let bestIndex = -1;
        
        indices.forEach((index) => {
          const net = player.net[index];
          if (net < bestNet) {
            bestNet = net;
            bestIndex = index;
          }
        });
        
        return { bestNet: bestNet === Infinity ? 0 : bestNet, bestIndex };
      };

      // Obtener handicap del mejor score
      const getHandicapForBestScore = (player: ITournamentPlayer, bestIndex: number) => {
        if (bestIndex < 0 || !player.handicap) {
          return 0;
        }
        return player.handicap[bestIndex] || 0;
      };

      // Obtener course del mejor score usando scoreId
      const getCourseForBestScore = (player: ITournamentPlayer, bestIndex: number) => {
        if (bestIndex < 0 || !player.scoreId) {
          return "-";
        }
        const scoreId = player.scoreId[bestIndex];
        if (!scoreId) {
          return "-";
        }
        const match = scoreIdToMatch.get(scoreId);
        return match?.courseDisplayName || match?.course || "-";
      };

      // Formatear todos los net del round separados por |
      const getNetScoresFormatted = (player: ITournamentPlayer) => {
        const scores = getNetScoresInRange(player);
        if (scores.length === 0) {
          return "-";
        }
        return scores.join(" | ");
      };

      // Obtener el mejor net de un stage específico
      const getBestNetForStage = (player: ITournamentPlayer, stageStart: string, stageEnd: string) => {
        const scoresInStage: number[] = [];
        player.net.forEach((net, index) => {
          const matchDate = player.date?.[index] ?? "";
          if (matchDate >= stageStart && matchDate <= stageEnd) {
            scoresInStage.push(net);
          }
        });
        if (scoresInStage.length === 0) {
          return 0;
        }
        return Math.min(...scoresInStage);
      };

      // Calcular datos para Championship
      const getChampionshipData = (player: ITournamentPlayer) => {
        const tournament = currentTournament || tournamentViewModel.tournament;
        const rounds = (tournament?.roundDates || tournament?.stagesDates) as unknown as {
          start: string;
          end: string;
        }[] || [];
        
        // Weighted Championship configurado en el torneo
        const champWeight = tournament?.weightedChampionshipRound || 1;

        // Obtener el mejor net de cada stage
        const stageScores = rounds.map((round) => {
          const start = convertDate(round.start, "MM/DD/YYYY");
          const end = convertDate(round.end, "MM/DD/YYYY");
          return getBestNetForStage(player, start, end);
        });

        // Obtener el score del día de Championship
        const champDate = tournament?.championshipDate 
          ? convertDate(tournament.championshipDate, "MM/DD/YYYY") 
          : "";
        const champScore = champDate ? getBestNetForStage(player, champDate, champDate) : 0;

        // ChampW = Score de Champ × Weighted Championship
        const champW = champScore > 0 ? Math.round(champScore * champWeight) : 0;

        // Total = ChampW + suma de stages (SIN incluir champScore directamente)
        const stagesSum = stageScores.reduce((acc, curr) => acc + curr, 0);
        const total = champW + stagesSum;

        return { stageScores, champScore, champW, total };
      };

      const players = teams[team].map((player) => {
        const { bestNet, bestIndex } = getBestNetInRound(player);
        const handicap = getHandicapForBestScore(player, bestIndex);
        const course = getCourseForBestScore(player, bestIndex);

        if (selectedRound === "champ") {
          const { stageScores, champScore, champW, total } = getChampionshipData(player);
          return {
            player: player.name,
            bestNet: 0,
            netScores: "-",
            totalNet: total,
            handicap: handicap,
            course: course,
            stageScores,
            champScore,
            champW,
          };
        }

        return {
          player: player.name,
          bestNet: bestNet,
          netScores: getNetScoresFormatted(player),
          totalNet: 0,
          handicap: handicap,
          course: course,
        };
      });

      finalPlayers.push(...players);
    }

    // Ordenar por mejor net (ascendente - menos strokes netos = mejor, considera handicap)
    // Para Championship ordenar por total, para rounds por bestNet
    const sortedPlayers = finalPlayers.sort((a, b) => {
      if (selectedRound === "champ") {
        // Championship: Jugadores CON score en Championship van arriba, SIN score van al final
        const aHasChamp = (a.champScore ?? 0) > 0;
        const bHasChamp = (b.champScore ?? 0) > 0;
        
        // Si uno tiene champ score y el otro no, el que tiene va arriba
        if (aHasChamp && !bHasChamp) {
          return -1;  // a va arriba
        }
        if (!aHasChamp && bHasChamp) {
          return 1;   // b va arriba
        }
        
        // Si ambos tienen o ambos no tienen champ score, ordenar por totalNet
        if (a.totalNet === 0 && b.totalNet === 0) {
          return 0;
        }
        if (a.totalNet === 0) {
          return 1;
        }
        if (b.totalNet === 0) {
          return -1;
        }
        return a.totalNet - b.totalNet;
      } else {
        // Stages: Filtrar jugadores sin score
        if (a.bestNet === 0 && b.bestNet === 0) {
          return 0;
        }
        if (a.bestNet === 0) {
          return 1;
        }
        if (b.bestNet === 0) {
          return -1;
        }
        return a.bestNet - b.bestNet;
      }
    });

    setPlayersToDisplay(sortedPlayers);
  }, [dateRange, tournamentViewModel.fullStatsTeams, selectedRound, matches]);

  const champTableHeader = () => {
    const stageHeaders = Array.from({ length: numberOfRounds }).map((_, i) => (
      <TableCell key={`stage-${i}`} sx={{ textAlign: "center" }}>Stage {i + 1}</TableCell>
    ));
    
    return (
      <TableRow>
        <TableCell sx={{ textAlign: "center" }}> </TableCell>
        <TableCell sx={{ textAlign: "center" }}>Name</TableCell>
        <TableCell sx={{ textAlign: "center" }}>Total</TableCell>
        <TableCell sx={{ textAlign: "center" }}>ChampW</TableCell>
        {stageHeaders}
        <TableCell sx={{ textAlign: "center" }}>Champ</TableCell>
      </TableRow>
    );
  };

  const stageTableHeader = () => (
    <TableRow>
      <TableCell sx={{ textAlign: "center" }}> </TableCell>
      <TableCell sx={{ textAlign: "center" }}>Name</TableCell>
      <TableCell sx={{ textAlign: "center" }}>Best Net</TableCell>
      <TableCell sx={{ textAlign: "center" }}>HCP</TableCell>
      <TableCell sx={{ textAlign: "center" }}>Course</TableCell>
      <TableCell sx={{ textAlign: "center" }}>Scores</TableCell>
    </TableRow>
  );

  const champTableRows = () =>
    playersToDisplay
      .filter((p) => p.totalNet > 0) // Solo mostrar jugadores con score
      .map((t, i) => {
        const stageCells = (t.stageScores || []).map((score, idx) => (
          <TableCell key={`stage-${idx}`} sx={{ textAlign: "center" }}>
            {score > 0 ? score : "-"}
          </TableCell>
        ));
        
        // Rellenar celdas vacías si hay menos stages que el número de rounds
        const emptyCells = Array.from({ 
          length: numberOfRounds - (t.stageScores?.length || 0) 
        }).map((_, idx) => (
          <TableCell key={`empty-${idx}`} sx={{ textAlign: "center" }}>-</TableCell>
        ));

        return (
          <TableRow key={t.player}>
            <TableCell sx={{ textAlign: "center" }}>{i + 1}</TableCell>
            <TableCell sx={{ textAlign: "center" }}>{t.player}</TableCell>
            <TableCell sx={{ textAlign: "center" }}>
              {t.totalNet > 0 ? t.totalNet : "-"}
            </TableCell>
            <TableCell sx={{ textAlign: "center" }}>
              {t.champW && t.champW > 0 ? t.champW : "-"}
            </TableCell>
            {stageCells}
            {emptyCells}
            <TableCell sx={{ textAlign: "center" }}>
              {t.champScore && t.champScore > 0 ? t.champScore : "-"}
            </TableCell>
          </TableRow>
        );
      });

  const stageTableRows = () =>
    playersToDisplay
      .filter((p) => p.bestNet > 0) // Solo mostrar jugadores con score
      .map((t, i) => (
        <TableRow key={t.player}>
          <TableCell sx={{ textAlign: "center" }}>{i + 1}</TableCell>
          <TableCell sx={{ textAlign: "center" }}>{t.player}</TableCell>
          <TableCell sx={{ textAlign: "center" }}>
            {t.bestNet > 0 ? t.bestNet : "-"}
          </TableCell>
          <TableCell sx={{ textAlign: "center" }}>
            {t.handicap > 0 ? t.handicap : "-"}
          </TableCell>
          <TableCell sx={{ textAlign: "center" }}>{t.course}</TableCell>
          <TableCell sx={{ textAlign: "center" }}>{t.netScores}</TableCell>
        </TableRow>
      ));

  // Usar roundDates o stagesDates del torneo actual o del viewModel
  const tournamentData = currentTournament || tournamentViewModel.tournament;
  const roundDatesAsRanges = (tournamentData?.roundDates || tournamentData?.stagesDates) as unknown as {
    start: string;
    end: string;
  }[] || [];
  
  const numberOfRounds = roundDatesAsRanges.length || currentTournament?.numberOfRounds || 0;
  
  const stageButtons = Array.from({ length: numberOfRounds }).map(
    (_, index) => {
      return (
        <Button
          key={index}
          variant={selectedRound === index.toString() ? "contained" : "outlined"}
          onClick={() => {
            setSelectedRound(index.toString());
            setDateRange({
              start: convertDate(roundDatesAsRanges[index]?.start || "", "MM/DD/YYYY"),
              end: convertDate(roundDatesAsRanges[index]?.end || "", "MM/DD/YYYY"),
            });
          }}
        >
          Stage {index + 1}
        </Button>
      );
    }
  );

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
          {stageButtons.map((button) => button)}
          {(currentTournament?.championshipRound || tournamentViewModel.tournament?.championshipRound) && (
            <Button
              variant={selectedRound === "champ" ? "contained" : "outlined"}
              key="champ"
              onClick={() => {
                const champDate = currentTournament?.championshipDate || 
                  tournamentViewModel.tournament?.championshipDate || "";
                setSelectedRound("champ");
                setDateRange({
                  start: convertDate(champDate, "MM/DD/YYYY"),
                  end: convertDate(champDate, "MM/DD/YYYY"),
                });
              }}
            >
              Championship
            </Button>
          )}
        </Box>
      </div>

      <div>
        <Typography variant="body2" color="textSecondary">
          {dateRange.start} - {dateRange.end}
        </Typography>
      </div>

      <TableContainer component={Box}>
        <Table>
          <TableHead>
            {selectedRound === "champ" ? champTableHeader() : stageTableHeader()}
          </TableHead>
          <TableBody>
            {selectedRound === "champ" ? champTableRows() : stageTableRows()}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default observer(DerbyBoard);


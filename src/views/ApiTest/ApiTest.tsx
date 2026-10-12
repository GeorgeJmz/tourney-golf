import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  getAllUsers,
  getAllTournaments,
  getBoard,
  getStandings,
  getCourses,
  getOpponents,
  createMatchEndpoint,
  createMatchBackend,
  getStats,
  deleteAccount,
  getRules,
  getResults,
  getAllLeagues,
  getTeamboard,
  getPlayerBoard,
  getPlayoffs,
} from "../../services/firebase";
import UserViewModel from "../../viewModels/UserViewModel";

interface ApiResponse {
  [key: string]: unknown;
}

type ApiFunction<T extends unknown[] = unknown[]> = (
  ...args: T
) => Promise<unknown>;

interface IApiTest {
  user: UserViewModel;
}

interface TournamentIdName {
  id: string;
  name: string;
}

function isTournament(obj: unknown): obj is { id: string; name: string } {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "name" in obj &&
    typeof (obj as { id: unknown }).id === "string" &&
    typeof (obj as { name: unknown }).name === "string"
  );
}

const ApiTest: React.FC<IApiTest> = ({ user }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tournamentId, setTournamentId] = useState<string>("");
  const [tournaments, setTournaments] = useState<TournamentIdName[]>([]);

  React.useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const all = await getAllTournaments();
        const tournamentsList: TournamentIdName[] = all
          .filter((t) => typeof t.id === "string" && t.id)
          .map((t) => ({ id: t.id as string, name: t.name }));
        setTournaments(tournamentsList);
        if (tournamentsList.length > 0) {
          setTournamentId(tournamentsList[0].id);
        }
      } catch (e) {
        setTournaments([]);
      }
    };
    fetchTournaments();
  }, []);

  const handleApiCall = async <T extends unknown[]>(
    apiFunction: ApiFunction<T>,
    ...args: T
  ) => {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const result = await apiFunction(...args);
      setResponse(result as ApiResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const renderResponse = () => {
    if (loading) {
      return <CircularProgress />;
    }
    if (error) {
      return <Typography color="error">{error}</Typography>;
    }
    if (response) {
      return (
        <Paper
          sx={{
            p: 2,
            mt: 2,
            maxHeight: "600px",
            overflow: "auto",
            textAlign: "left",
          }}
        >
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        API Endpoint Tests
      </Typography>

      <FormControl fullWidth sx={{ mb: 2, maxWidth: 400 }} size="small">
        <InputLabel id="tournament-select-label">Tournament</InputLabel>
        <Select
          labelId="tournament-select-label"
          value={tournamentId}
          label="Tournament"
          onChange={(e) => setTournamentId(e.target.value)}
        >
          {tournaments.map((t) => (
            <MenuItem key={t.id} value={t.id}>
              {t.name} ({t.id})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
        <Button variant="contained" onClick={() => handleApiCall(getAllUsers)}>
          Get All Users
        </Button>

        <Button
          variant="contained"
          onClick={() => handleApiCall(getAllLeagues, user.user.id || "")}
        >
          Get All Leagues
        </Button>

        <Button
          variant="contained"
          onClick={() => handleApiCall(getBoard, tournamentId)}
        >
          Get Board
        </Button>

        <Button
          variant="contained"
          onClick={() => handleApiCall(getStandings, tournamentId)}
        >
          Get Standings
        </Button>

        <Button
          variant="contained"
          onClick={() => handleApiCall(getCourses, user.user.id || "")}
        >
          Get Courses
        </Button>

        <Button
          variant="contained"
          onClick={() =>
            handleApiCall(getOpponents, user.user.email || "", tournamentId)
          }
        >
          Get Opponents
        </Button>

        <Button
          variant="contained"
          onClick={() =>
            handleApiCall(createMatchEndpoint, user.user.id || "", tournamentId)
          }
        >
          Create Match (Legacy)
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={async () => {
            // Test data for the new unified endpoint
            const testPayload = {
              author: user.user.id || "",
              tournamentId: tournamentId,
              course: "AndalusiaCountryClub",
              courseDisplayName: "Andalusia Country Club",
              teeBox: "BlueAndalusiaCountryClub",
              teeBoxDisplayName: "Blue",
              scores: [
                {
                  player: user.user.name + " " + user.user.lastName,
                  idPlayer: user.user.email,
                  scoreHoles: [3, 3, 5, 4, 4, 4, 3, 4, 4, 4, 4, 3, 4, 3, 5, 4, 4, 5],
                  handicap: 5,
                  out: 34,
                  in: 36,
                  totalGross: 70,
                  totalNet: 65,
                  teamPoints: [3, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2],
                },
                {
                  player: "Test Player 1",
                  idPlayer: "test1@gmail.com",
                  scoreHoles: [4, 3, 5, 4, 4, 4, 3, 4, 5, 4, 4, 3, 4, 3, 5, 4, 4, 5],
                  handicap: 8,
                  out: 36,
                  in: 36,
                  totalGross: 72,
                  totalNet: 64,
                  teamPoints: [2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
                },
              ],
              message: "Test match from API Test page - Backend handles type detection",
            };
            await handleApiCall(createMatchBackend, testPayload);
          }}
        >
          Create Match (NEW - Unified)
        </Button>

        <Button
          variant="contained"
          color="info"
          onClick={async () => {
            // Test data for multi-player match (teamplay/dogfight)
            const testPayload = {
              author: user.user.id || "",
              tournamentId: tournamentId,
              course: "AndalusiaCountryClub",
              courseDisplayName: "Andalusia Country Club",
              teeBox: "BlueAndalusiaCountryClub",
              teeBoxDisplayName: "Blue",
              scores: [
                {
                  player: user.user.name + " " + user.user.lastName,
                  idPlayer: user.user.email,
                  scoreHoles: [3, 3, 5, 4, 4, 4, 3, 4, 4, 4, 4, 3, 4, 3, 5, 4, 4, 5],
                  handicap: 5,
                  out: 34,
                  in: 36,
                  totalGross: 70,
                  totalNet: 65,
                  teamPoints: [3, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2],
                },
                {
                  player: "Test Player 1",
                  idPlayer: "test1@gmail.com",
                  scoreHoles: [4, 3, 5, 4, 4, 4, 3, 4, 5, 4, 4, 3, 4, 3, 5, 4, 4, 5],
                  handicap: 8,
                  out: 36,
                  in: 36,
                  totalGross: 72,
                  totalNet: 64,
                  teamPoints: [2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
                },
                {
                  player: "Test Player 2",
                  idPlayer: "test2@gmail.com",
                  scoreHoles: [4, 4, 6, 5, 5, 4, 3, 5, 5, 4, 5, 3, 4, 4, 6, 5, 4, 5],
                  handicap: 12,
                  out: 38,
                  in: 40,
                  totalGross: 78,
                  totalNet: 66,
                  teamPoints: [1, 1, 1, 1, 1, 2, 2, 1, 1, 2, 1, 2, 2, 1, 1, 1, 2, 2],
                },
                {
                  player: "Test Player 3",
                  idPlayer: "test3@gmail.com",
                  scoreHoles: [5, 4, 5, 4, 5, 5, 4, 4, 4, 5, 4, 4, 5, 3, 5, 4, 5, 6],
                  handicap: 10,
                  out: 38,
                  in: 41,
                  totalGross: 79,
                  totalNet: 69,
                  teamPoints: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                },
              ],
              message: "Test multi-player match (4 players) - Backend calculates round",
            };
            await handleApiCall(createMatchBackend, testPayload);
          }}
        >
          Create Match (Multi-Player Test)
        </Button>

        <Button
          variant="contained"
          onClick={() => handleApiCall(getStats, tournamentId)}
        >
          Get Stats
        </Button>

        <Button
          variant="contained"
          onClick={() => handleApiCall(getRules, tournamentId)}
        >
          Get Rules URLs
        </Button>

        <Button
          variant="contained"
          onClick={() => handleApiCall(getResults, tournamentId)}
        >
          Get Results
        </Button>

        <Button
          variant="contained"
          onClick={() => handleApiCall(getTeamboard, tournamentId)}
        >
          Get Team Board
        </Button>

        <Button
          variant="contained"
          onClick={() => handleApiCall(getPlayerBoard, tournamentId)}
        >
          Get Player Board
        </Button>

        <Button
          variant="contained"
          onClick={() => handleApiCall(getPlayoffs, tournamentId)}
        >
          Get Playoffs
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={() => handleApiCall(deleteAccount, user.user.id || "")}
        >
          Delete Account (Soft Delete)
        </Button>
      </Box>
      <Box>{tournamentId}</Box>
      {renderResponse()}
    </Box>
  );
};

export default ApiTest;

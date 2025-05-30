import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../../hooks/useUserContext";
import {
  getAllUsers,
  getAllLeagues,
  getBoard,
  getStandings,
  getCourses,
  getOpponents,
  createMatchEndpoint,
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

const ApiTest: React.FC<IApiTest> = ({ user }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const tournamentId = "pZNYIPkKf3xje4gDaRj1";
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
        <Paper sx={{ p: 2, mt: 2, maxHeight: "400px", overflow: "auto" }}>
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

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
        <Button variant="contained" onClick={() => handleApiCall(getAllUsers)}>
          Get All Users
        </Button>

        <Button
          variant="contained"
          onClick={() => handleApiCall(getAllLeagues, user.user.email || "")}
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
          Create Match
        </Button>
      </Box>

      {renderResponse()}
    </Box>
  );
};

export default ApiTest;

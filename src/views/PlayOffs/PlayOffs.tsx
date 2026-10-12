import Box from "@mui/material/Box";
import React from "react";
import type TournamentViewModel from "../../viewModels/TournamentViewModel";
import BracketComponent from "./components/Brackets/Brackets";
import SimplePlayOffs from "./components/SimplePlayOffs/SimplePlayOffs";
import { toJS } from "mobx";
import { useNavigate } from "react-router-dom";
import { IPlayer, IPlayOffsDetail } from "../../models/Tournament";
import { Button, ButtonGroup, Typography } from "@mui/material";
import { getTournamentsById } from "../../services/firebase";

interface PLayOffsProps {
  tournamentViewModel: TournamentViewModel;
  isPlayer?: boolean;
  readOnly?: boolean;
}

const PLayOffs: React.FC<PLayOffsProps> = ({
  tournamentViewModel,
  isPlayer,
  readOnly,
}) => {
  const [viewMode, setViewMode] = React.useState<"bracket" | "simple">(
    "bracket"
  );
  const [playOffsData, setPlayOffsData] =
    React.useState<IPlayOffsDetail | null>(null);

  const playersNames = tournamentViewModel.matrizValues.names.map((value) => {
    const playersResults = Object.keys(value.results).map((key) => ({
      name: value.results[key] || "",
      id: key || "",
    }));
    return playersResults;
  });

  const players = toJS(tournamentViewModel.tournament.playersList);
  const details = toJS(tournamentViewModel.tournament.playOffsDetail);

  // Load playoffs data from Firebase
  React.useEffect(() => {
    const loadPlayOffsData = async () => {
      try {
        const tournaments = await getTournamentsById([
          tournamentViewModel.idTournament,
        ]);
        if (tournaments && tournaments.length > 0) {
          const tournament = tournaments[0];
          console.log("PlayOffs - Loaded tournament data:", tournament);
          console.log(
            "PlayOffs - playOffsDetail from Firebase:",
            tournament.playOffsDetail
          );
          setPlayOffsData(tournament.playOffsDetail);
        }
      } catch (error) {
        console.error("Error loading playoffs data:", error);
      }
    };

    if (tournamentViewModel.idTournament) {
      loadPlayOffsData();
    }
  }, [tournamentViewModel.idTournament]);

  // Debug logs
  React.useEffect(() => {
    console.log("PlayOffs - Tournament details:", details);
    console.log("PlayOffs - details.players:", details.players);
    console.log("PlayOffs - details.brackets:", details.brackets);
    console.log("PlayOffs - details.matches:", details.matches);
    console.log("PlayOffs - playOffsData from Firebase:", playOffsData);
  }, [details, playOffsData]);

  const navigate = useNavigate();

  const onSaveBracket = async (
    brackets: {
      [key: string]: string;
    },
    matches: {
      [key: string]: string[];
    },
    numberOfPlayers: number
  ) => {
    if (readOnly) {
      return; // No permitir guardar en modo solo lectura
    }
    await tournamentViewModel.addPlayOffsDetails(
      numberOfPlayers,
      brackets,
      matches
    );
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  // Use playOffsData from Firebase if available, otherwise use details from tournamentViewModel
  const finalDetails = playOffsData || details;

  return (
    <Box alignContent="center">
      {!isPlayer && !readOnly && (
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Playoffs Setup
          </Typography>
          {/* <ButtonGroup variant="outlined" sx={{ mb: 2 }}>
            <Button
              variant={viewMode === "bracket" ? "contained" : "outlined"}
              onClick={() => setViewMode("bracket")}
            >
              Bracket View
            </Button>
            <Button
              variant={viewMode === "simple" ? "contained" : "outlined"}
              onClick={() => setViewMode("simple")}
            >
              Simple View
            </Button>
          </ButtonGroup> */}
        </Box>
      )}

      <SimplePlayOffs
        players={playersNames.flat() as Partial<IPlayer>[]}
        numberOfPreviousPlayers={finalDetails.players}
        previousPlayers={finalDetails.brackets}
        previousMatches={finalDetails.matches}
        onSaveBracket={onSaveBracket}
        exportMatrix={{
          name: tournamentViewModel.tournament.name,
          emails: players.map((player) => player.email || "") || [],
        }}
        readOnly={readOnly}
      />
      {/* {viewMode === "bracket" ? (
        <BracketComponent
          players={playersNames.flat() as Partial<IPlayer>[]}
          numberOfPreviousPlayers={finalDetails.players}
          previousPlayers={finalDetails.brackets}
          previousMatches={finalDetails.matches}
          onSaveBracket={onSaveBracket}
          isPlayer={isPlayer}
          exportMatrix={{
            name: tournamentViewModel.tournament.name,
            emails: players.map((player) => player.email || "") || [],
          }}
        />
      ) : (
        <SimplePlayOffs
          players={playersNames.flat() as Partial<IPlayer>[]}
          numberOfPreviousPlayers={finalDetails.players}
          previousPlayers={finalDetails.brackets}
          previousMatches={finalDetails.matches}
          onSaveBracket={onSaveBracket}
        />
      )} */}
    </Box>
  );
};

export default PLayOffs;

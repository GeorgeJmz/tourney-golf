import Box from "@mui/material/Box";
import React from "react";
import type TournamentViewModel from "../../viewModels/TournamentViewModel";
import BracketComponent from "./components/Brackets/Brackets";
import { toJS } from "mobx";
import { useNavigate } from "react-router-dom";

interface PLayOffsProps {
  tournamentViewModel: TournamentViewModel;
  isPlayer?: boolean;
}

const PLayOffs: React.FC<PLayOffsProps> = ({
  tournamentViewModel,
  isPlayer,
}) => {
  const players = toJS(tournamentViewModel.tournament.playersList);
  const details = toJS(tournamentViewModel.tournament.playOffsDetail);
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
    await tournamentViewModel.addPlayOffsDetails(
      numberOfPlayers,
      brackets,
      matches
    );
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };
  return (
    <Box alignContent="center">
      <BracketComponent
        players={players}
        numberOfPreviousPlayers={details.players}
        previousPlayers={details.brackets}
        previousMatches={details.matches}
        onSaveBracket={onSaveBracket}
        isPlayer={isPlayer}
      />
    </Box>
  );
};

export default PLayOffs;

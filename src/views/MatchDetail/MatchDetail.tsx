import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { Navigate, useLocation, Link, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useUserContext";
import {
  Button,
  Box,
  Grid,
  Paper,
  Container,
  FormControl,
} from "@mui/material";
import {
  profileFieldsValidation,
  profileFields,
  profileElementsSettings,
  IProfileElement,
} from "../../helpers/getAccountFields";
import { useFormik } from "formik";
import { TextInput } from "../../components/TextInput";
import { NavbarTitleContext } from "../../hooks/useNavContext";
import UserViewModel from "../../viewModels/UserViewModel";

import { getScoresByID, getMatchById } from "../../services/firebase";
import MatchViewModel from "../../viewModels/MatchViewModel";
import ScoreViewModel from "../../viewModels/ScoreViewModel";
import HorizontalScoreCard from "../Play/components/HorizontalScoreCard";

interface IMatchDetailPageProps {
  user: UserViewModel;
}

const MatchDetail: React.FC<IMatchDetailPageProps> = ({ user }) => {
  const { id } = useParams();
  const match = React.useMemo(() => new MatchViewModel(), []);
  const [matchId, setMatchId] = React.useState<string>("");
  const [hideMatch, setHideMatch] = React.useState<boolean>(false);
  const [hideTeam, setHideTeam] = React.useState<boolean>(false);
  const [hideMedal, setHideMedal] = React.useState<boolean>(false);
  const [hideWinner, setHideWinner] = React.useState<boolean>(false);
  const [courseDisplayName, setCourseDisplayName] = React.useState<string>("");
  const [teeBoxDisplayName, setTeeBoxDisplayName] = React.useState<string>("");

  const getScores = async () => {
    // Parsear la URL: "scoreId1-scoreId2-...-match-true-team-false-medal-true-winner-false-matchid-abc123"
    const urlParts = id?.split("-") || [];
    
    // Separar scoresId de los parámetros
    const matchIndex = urlParts.findIndex(part => part === "match");
    if (matchIndex === -1) {
      console.error("Invalid URL format");
      return;
    }

    const scoresId = urlParts.slice(0, matchIndex);
    const params = urlParts.slice(matchIndex);
    
    // Extraer flags de la URL (ya vienen calculados)
    const matchFlag = params[1] === "true" ? false : true;  // invertido porque hideMatch
    const teamFlag = params[3] === "true" ? false : true;
    const medalFlag = params[5] === "true" ? false : true;
    const winnerFlag = params[7] === "true" ? false : true;
    
    setHideMatch(matchFlag);
    setHideTeam(teamFlag);
    setHideMedal(medalFlag);
    setHideWinner(winnerFlag);

    // Extraer matchId de la URL
    const matchIdIndex = params.findIndex(part => part === "matchid");
    const extractedMatchId = matchIdIndex !== -1 && matchIdIndex < params.length - 1
      ? params[matchIdIndex + 1]
      : null;

    if (!extractedMatchId) {
      console.error("No matchId found in URL");
      return;
    }

    // Cargar SOLO el match para obtener la información del curso
    const matchData = await getMatchById(extractedMatchId);
    if (matchData) {
      setCourseDisplayName(matchData.courseDisplayName || "");
      setTeeBoxDisplayName(matchData.teeBoxDisplayName || "");
    }

    // Cargar los scores de los jugadores usando los IDs de la URL
    const scorePromises = scoresId.map(async (scoreId) => {
      const scores = await getScoresByID(scoreId);
      const scoreModel = new ScoreViewModel();
      if (scores) {
        scoreModel.score = scores;
      }
      return scoreModel;
    });

    const scores = await Promise.all(scorePromises);
    match.players = scores;

    if (scores.length > 1) {
      match.calculateWinners();
    }

    setTimeout(() => {
      setMatchId(extractedMatchId);
    }, 100);
  };

  useEffect(() => {
    getScores();
  }, [id]);

  return (
    <div>
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          position: "relative",
          bgcolor: "background.paper",
          p: 0,
          "@media (min-width: 850px)": {
            p: 3,
          },
        }}
      >
        {matchId !== "" && (
          <HorizontalScoreCard
            match={match}
            hideMatch={hideMatch}
            hideTeam={hideTeam}
            hideMedal={hideMedal}
            hideWinner={hideWinner}
            courseDisplayName={courseDisplayName}
            teeBoxDisplayName={teeBoxDisplayName}
          />
        )}
      </Box>
    </div>
  );
};

export default observer(MatchDetail);

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

import { getScoresByID } from "../../services/firebase";
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

  const getScores = async () => {
    const players = [id?.split("-")[0], id?.split("-")[1]];
    const m = id?.split("-")[3] === "true" ? true : false;
    const team = id?.split("-")[5] === "true" ? true : false;
    const score = [];
    for (const player of players) {
      const scores = await getScoresByID(player || "");
      const scoreModel = new ScoreViewModel();
      if (scores) {
        scoreModel.score = scores;
      }

      score.push(scoreModel);
    }

    match.players = score;

    match.calculateWinners();
    setHideMatch(m);
    setHideTeam(team);
    setMatchId("sadasdasdsa");
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
          />
        )}
      </Box>
    </div>
  );
};

export default observer(MatchDetail);

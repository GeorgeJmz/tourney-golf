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
  const [hideMedal, setHideMedal] = React.useState<boolean>(false);
  const [hideWinner, setHideWinner] = React.useState<boolean>(false);

  const getScores = async () => {
    const n = id?.split("-") || []; // "oRkIhspefwzCGhdNQJZ6-match-false-team-true-medal-true".split("-");
    const npl = [] as string[];
    const nparam = [] as string[];
    let aux = true;
    if (n.length > 0) {
      n.forEach((element) => {
        if (element === "match") {
          aux = false;
        }
        if (aux) {
          npl.push(element);
        } else {
          nparam.push(element);
        }
      });
    }
    const players = npl;
    const params = nparam;
    const m = params[1] === "true" ? false : true;
    const team = params[3] === "true" ? false : true;
    const medal = params[5] === "true" ? false : true;
    const hideW = params[7] === "true" ? false : true;
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

    if (score.length > 1) {
      match.calculateWinners();
    }
    setHideMatch(m);
    setHideMedal(medal);
    setHideTeam(team);
    setHideWinner(hideW);
    setTimeout(() => {
      setMatchId("sadasdasdsa");
    }, 500);
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
          />
        )}
      </Box>
    </div>
  );
};

export default observer(MatchDetail);

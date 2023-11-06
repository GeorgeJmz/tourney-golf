import React from "react";
import { observer } from "mobx-react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import UserViewModel from "../../viewModels/UserViewModel";
import {
  invitationsMatch,
  invitationsFieldsValidations,
} from "../../helpers/getTournamentFields";
import { Invitations } from "../../components/Invitations";
import { MatchModal } from "./components/MatchModal";
import PlayViewModel from "../../viewModels/PlayViewModel";
import CourseList from "./components/CourseList";
import { GolfCourse } from "../../services/courses";
import { ScoreTable } from "./components/ScoreTable";
import HorizontalScoreCard from "./components/HorizontalScoreCard";
import { useNavigate, useParams } from "react-router-dom";
import { toJS } from "mobx";
import type { IUser } from "../../models/User";
import { Button } from "@mui/material";

interface IPlayProps {
  user: UserViewModel;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Play: React.FC<IPlayProps> = ({ user }) => {
  const playViewModel = React.useMemo(() => new PlayViewModel(), []);
  const navigate = useNavigate();
  const { id } = useParams();
  const currentTournament = React.useMemo(
    () => user.tournaments.find((t) => t.id === id),
    []
  );

  playViewModel.tournamentId = id || "";

  const findConferenceByEmail = (email: string) => {
    const player = currentTournament?.playersList.find(
      (player) => player.email === email
    );

    return player?.conference;
  };

  const getPlayersByConference = (conferenceId: string) => {
    const players = currentTournament?.playersList.filter(
      (player) => player.conference === conferenceId
    );
    return players;
  };

  const playersToInvite = React.useMemo(
    () => getPlayersByConference(findConferenceByEmail(user.user.email) || ""),
    []
  );

  if (playViewModel.getAuthor() === "") {
    playViewModel.setAuthor(user);
  }
  const onFillResults = () => {
    Array.from(Array(18).keys()).forEach((hole) => {
      const scores = playViewModel.allPlayers.map((player) => {
        const score = Math.floor(Math.random() * 10) || 3;
        return score;
      });
      playViewModel.setScoreModal(scores, hole);
    });
  };

  const onSaveHandler = () => {
    if (playViewModel.currentStep === 2) {
      playViewModel.createMatch();
      setTimeout(() => navigate("/dashboard"), 5000);
    } else {
      playViewModel.setCurrentStep(playViewModel.currentStep + 1);
    }
  };
  const validationSchema = invitationsFieldsValidations;
  const emailList = playViewModel.emailList;
  const onSubmitHandler = (email: string, name: string, handicap: number) => {
    playViewModel.addEmailToList(email, name, handicap);
  };
  const onUpdateHandler = (
    email: string,
    name: string,
    handicap: number,
    key: number
  ) => {
    playViewModel.updateEmailList(email, name, handicap, key);
  };

  const onRemoveHandler = (key: number) => {
    playViewModel.removeEmailFromList(key);
  };

  const handleCloseModal = () => {
    playViewModel.setModal(false);
  };
  const handleOpenModal = (key: number) => {
    console.log(key);
    playViewModel.setModal(true);
    playViewModel.setModalValues(key);
  };
  const onSetScore = (temporalScores: Array<number>, hole: number) =>
    playViewModel.setScoreModal(temporalScores, hole);

  const onOpenCourse = (id: string) => {
    playViewModel.openCloseCourse(id);
  };
  const onSelectTeeBox = (course: GolfCourse, id: string) =>
    playViewModel.selectTeeBox(course, id);
  const submitButtonText = ["Choose course", "Start Match", "End Match"];

  const [value, setValue] = React.useState(1);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <div>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          position: "relative",
          bgcolor: "background.paper",
          p: 3,
        }}
      >
        {playViewModel.currentStep === 0 && (
          <CourseList
            courses={playViewModel.courses}
            currentTeeBox={playViewModel.currentTeeBox}
            onOpenCourse={onOpenCourse}
            onSelectTeeBox={onSelectTeeBox}
          />
        )}
        {playViewModel.currentStep === 1 && (
          <Invitations
            playersToInvite={
              (playersToInvite?.filter(
                (player) => player?.email !== user.user.email
              ) || []) as IUser[]
            }
            fields={invitationsMatch}
            emailList={emailList}
            validationSchema={validationSchema}
            onSubmit={onSubmitHandler}
            onUpdate={onUpdateHandler}
            onDelete={onRemoveHandler}
          />
        )}
        {playViewModel.currentStep === 2 && (
          <React.Fragment>
            <Tabs value={value} onChange={handleChange} centered>
              <Tab label="Round" />
              <Tab label="Score" />
            </Tabs>
            <TabPanel value={value} index={0}>
              <React.Fragment>
                {playViewModel.matches.map((match) => (
                  <HorizontalScoreCard match={match} />
                ))}
              </React.Fragment>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <ScoreTable
                currentDistance={playViewModel.currentDistance}
                currentTeeBoxDisplayName={
                  playViewModel.currentTeeBoxDisplayName
                }
                currentHcp={playViewModel.currentHcp}
                currentPar={playViewModel.currentPar}
                currentOut={playViewModel.matches[0].players[0].score.out}
                currentIn={playViewModel.matches[0].players[0].score.in}
                currentTotal={
                  playViewModel.matches[0].players[0].score.totalGross
                }
                authorScores={
                  playViewModel.matches[0].players[0].score.scoreHoles
                }
                onOpenModal={handleOpenModal}
              />

              <MatchModal
                hole={parseInt(playViewModel.holeModal)}
                par={parseInt(playViewModel.parModal)}
                onSetScore={onSetScore}
                players={playViewModel.allPlayers}
                isOpen={playViewModel.openModal}
                onCloseModal={handleCloseModal}
              />
            </TabPanel>
          </React.Fragment>
        )}

        <Button
          sx={{ marginTop: "20px", minWidth: "250px" }}
          color="primary"
          variant="contained"
          size="large"
          onClick={onSaveHandler}
          disabled={playViewModel.currentTeeBox === ""}
        >
          {submitButtonText[playViewModel.currentStep]}
        </Button>

        {/* <Fab
          color="primary"
          variant="extended"
          disabled={playViewModel.currentTeeBox === ""}
          onClick={onSaveHandler}
          sx={{
            position: "fixed",
            bottom: "16px",
            width: 250,
            marginLeft: "-125px",
          }}
        >
          {submitButtonText[playViewModel.currentStep]}
        </Fab> */}
        {playViewModel.currentStep === 2 && (
          <Fab
            color="primary"
            variant="extended"
            disabled={playViewModel.currentTeeBox === ""}
            onClick={onFillResults}
            sx={{
              position: "fixed",
              bottom: "16px",
              width: 250,
              left: "0",
            }}
          >
            Mock Results
          </Fab>
        )}
      </Box>
    </div>
  );
};

export default observer(Play);

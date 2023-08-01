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
import { useNavigate } from "react-router-dom";

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

  if (playViewModel.getAuthor() === "") {
    playViewModel.setAuthor(user);
  }
  const onSaveHandler = () => {
    if (playViewModel.currentStep === 2) {
      playViewModel.createMatch();
      setTimeout(() => navigate("/dashboard"), 3000);
    } else {
      playViewModel.setCurrentStep(playViewModel.currentStep + 1);
    }
  };
  const validationSchema = invitationsFieldsValidations;
  const emailList = playViewModel.getEmailList();
  const onSubmitHandler = (email: string, name: string, strokes: number) => {
    playViewModel.addEmailToList(email, name, strokes);
  };
  const onUpdateHandler = (
    email: string,
    name: string,
    strokes: number,
    key: number
  ) => {
    playViewModel.updateEmailList(email, name, strokes, key);
  };

  const handleCloseModal = () => {
    playViewModel.setModal(false);
  };
  const handleOpenModal = (key: number) => {
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
            fields={invitationsMatch}
            emailList={emailList}
            validationSchema={validationSchema}
            onSubmit={onSubmitHandler}
            onUpdate={onUpdateHandler}
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
                currentOut={playViewModel.allPlayers[0].score.out}
                currentIn={playViewModel.allPlayers[0].score.in}
                currentTotal={playViewModel.allPlayers[0].score.total}
                authorScores={playViewModel.allPlayers[0].score.scoreHoles}
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

        <Fab
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
        </Fab>
      </Box>
    </div>
  );
};

export default observer(Play);
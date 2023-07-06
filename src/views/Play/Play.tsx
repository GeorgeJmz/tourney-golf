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
import MatchViewModel from "../../viewModels/MatchViewModel";
import CourseList from "./components/CourseList";
import { GolfCourse } from "../../services/courses";
import { ScoreTable } from "./components/ScoreTable";
import HorizontalScoreCard from "./components/HorizontalScoreCard";

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
  const matchViewModel = React.useMemo(() => new MatchViewModel(), []);
  if (matchViewModel.getAuthor() === "") {
    matchViewModel.setAuthor(user.getUserId());
  }
  const onSaveHandler = () => {
    if (matchViewModel.currentStep === 2) {
      matchViewModel.createMatch(matchViewModel.match);
    }
    matchViewModel.setCurrentStep(matchViewModel.currentStep + 1);
  };
  const validationSchema = invitationsFieldsValidations;
  const emailList = matchViewModel.getEmailList();
  const onSubmitHandler = (email: string, name: string, strokes: number) => {
    matchViewModel.addEmailToList(email, name, strokes);
  };
  const handleCloseModal = () => {
    matchViewModel.setModal(false);
  };
  const handleOpenModal = (key: number) => {
    matchViewModel.setModal(true);
    matchViewModel.setModalValues(key);
  };
  const onSetScore = () => matchViewModel.setScoreModal();

  const onOpenCourse = (id: string) => {
    matchViewModel.openCloseCourse(id);
  };
  const onSelectTeeBox = (course: GolfCourse, id: string) =>
    matchViewModel.selectTeeBox(course, id);
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
        {matchViewModel.currentStep === 0 && (
          <CourseList
            courses={matchViewModel.courses}
            currentTeeBox={matchViewModel.currentTeeBox}
            onOpenCourse={onOpenCourse}
            onSelectTeeBox={onSelectTeeBox}
          />
        )}
        {matchViewModel.currentStep === 1 && (
          <Invitations
            fields={invitationsMatch}
            emailList={emailList}
            validationSchema={validationSchema}
            onSubmit={onSubmitHandler}
          />
        )}
        {matchViewModel.currentStep === 2 && (
          <React.Fragment>
            <Tabs value={value} onChange={handleChange} centered>
              <Tab label="Round" />
              <Tab label="Score" />
            </Tabs>
            <TabPanel value={value} index={0}>
              <HorizontalScoreCard players={matchViewModel.players} />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <ScoreTable
                currentDistance={matchViewModel.currentDistance}
                currentTeeBoxDisplayName={
                  matchViewModel.currentTeeBoxDisplayName
                }
                currentHcp={matchViewModel.currentHcp}
                currentPar={matchViewModel.currentPar}
                currentOut={matchViewModel.players[0].score.out}
                currentIn={matchViewModel.players[0].score.in}
                currentTotal={matchViewModel.players[0].score.total}
                authorScores={matchViewModel.players[0].score.scoreHoles}
                onOpenModal={handleOpenModal}
              />

              <MatchModal
                hole={parseInt(matchViewModel.holeModal)}
                par={parseInt(matchViewModel.parModal)}
                onSetScore={onSetScore}
                players={matchViewModel.players}
                isOpen={matchViewModel.openModal}
                onCloseModal={handleCloseModal}
              />
            </TabPanel>
          </React.Fragment>
        )}

        <Fab
          color="primary"
          variant="extended"
          disabled={matchViewModel.currentTeeBox === ""}
          onClick={onSaveHandler}
          sx={{
            position: "fixed",
            bottom: "16px",
            width: 250,
            marginLeft: "-125px",
          }}
        >
          {submitButtonText[matchViewModel.currentStep]}
        </Fab>
      </Box>
    </div>
  );
};

export default observer(Play);

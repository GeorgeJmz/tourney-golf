import React, { useEffect } from "react";
import { observer } from "mobx-react";
import Box from "@mui/material/Box";
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
import type { IUser } from "../../models/User";
import { Button } from "@mui/material";
import { getPlayersByTournamentId } from "../../services/firebase";
import { ITournamentPlayer } from "../../models/Player";
import { ScoreBeforeLeave } from "./components/ScoreBeforeLeave";
import { LeaveModal } from "./components/LeaveModal";
import { useBlocker } from "react-router-dom";

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
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const Play: React.FC<IPlayProps> = ({ user }) => {
  const playViewModel = React.useMemo(() => new PlayViewModel(), []);
  const [currentPlayer, setCurrentPlayer] = React.useState<ITournamentPlayer>();
  const navigate = useNavigate();
  const { id } = useParams();
  const currentTournament = React.useMemo(
    () => user.activeTournaments.find((t) => t.id === id),
    []
  );

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      playViewModel.currentStep === 2 &&
      !openFinishModal &&
      currentLocation.pathname !== nextLocation.pathname
  );

  const [numberOfPlayers, setNumberOfPlayers] = React.useState<Array<number>>([
    2,
  ]);

  useEffect(() => {
    const getOpponents = async () => {
      const opponents = await getPlayersByTournamentId(
        currentTournament?.id || ""
      );
      const player = opponents.find(
        (player) => player.email === user.user.email
      );
      setCurrentPlayer(player);
    };
    playViewModel.tournamentId = currentTournament?.id || "";
    setNumberOfPlayers([2]);
    currentTournament?.matchesPerRound.forEach((match) => {
      const newPlayers = match === "double" ? 3 : match === "triple" ? 4 : 5;
      setNumberOfPlayers((prev) => [...prev, newPlayers]);
    });
    getOpponents();
    if (currentTournament) {
      playViewModel.currentTournament.name = currentTournament.name;
      playViewModel.currentTournament.pointsPerWin =
        currentTournament.pointsPerWin;
      playViewModel.currentTournament.pointsPerTie =
        currentTournament.pointsPerTie;
      playViewModel.currentTournament.pointsPerWinMedal =
        currentTournament.pointsPerWinMedal;
      playViewModel.currentTournament.pointsPerTieMedal =
        currentTournament.pointsPerTieMedal;
      playViewModel.currentTournament.playType = currentTournament.playType;
      playViewModel.currentTournament.tournamentType =
        currentTournament.tournamentType;
      playViewModel.currentTournament.playersList =
        currentTournament.playersList;
    }
  }, [currentTournament]);

  const tournamentType = currentTournament?.tournamentType;
  const playType = currentTournament?.playType;
  const hideTeam = tournamentType === "league";
  const hideMatch = playType === "strokePlay";
  const hideMedal = playType === "matchPlay";
  const findConferenceByEmail = (email: string) => {
    const player = currentTournament?.playersList.find(
      (player) => player.email === email
    );
    return player?.conference;
  };

  const getPlayersByConference = (conferenceId: string) => {
    const players = currentTournament?.playersList.filter(
      (player) =>
        player.conference === conferenceId &&
        !currentPlayer?.opponent?.includes(player.email || "")
    );
    return players;
  };

  const playersToInvite = React.useMemo(
    () => getPlayersByConference(findConferenceByEmail(user.user.email) || ""),
    [currentPlayer]
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

  const isDisabledButton = React.useMemo(() => {
    if (playViewModel.currentTeeBox === "" && playViewModel.currentStep === 0) {
      return true;
    }

    if (playViewModel.currentStep === 1) {
      return !numberOfPlayers.includes(playViewModel.emailList.length);
    }

    return false;
  }, [
    numberOfPlayers,
    playViewModel.emailList.length,
    playViewModel.currentTeeBox,
    playViewModel.currentStep,
  ]);

  const [openFinishModal, setOpenFinishModal] = React.useState(false);

  const onSaveHandler = () => {
    if (playViewModel.currentStep === 2) {
      setOpenFinishModal(true);
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
    playViewModel.setModal(true);
    playViewModel.setModalValues(key);
  };
  const handleNextHole = () => {
    playViewModel.setModalValues(playViewModel.modalKey + 1);
  };
  const handlePreviousHole = () => {
    playViewModel.setModalValues(playViewModel.modalKey - 1);
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

  const handleSubmit = (message: string) => {
    playViewModel.createMatch(message);
    setTimeout(() => navigate("/dashboard"), 5000);
  };

  const handleOnExit = () => {
    setTimeout(() => navigate("/dashboard"), 1);
  };

  const handleCancel = () => {
    setOpenFinishModal(false);
  };
  const showButton = !(playViewModel.currentStep === 2 && value !== 1);

  const isMobile = () =>
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  const isFull = playViewModel.matches.length > 2 || isMobile();
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
            showAll={false}
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
              <Tab label="Match" />
              <Tab label="Score" />
              <Tab label="Stakes" />
            </Tabs>
            <TabPanel value={value} index={0}>
              <React.Fragment>
                {playViewModel.matches.map((match) => (
                  <HorizontalScoreCard
                    match={match}
                    hideMatch={hideMatch}
                    hideTeam={hideTeam}
                    hideMedal={hideMedal}
                    isSmall={false}
                  />
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
                authorDisplayName={
                  playViewModel.matches[0].players[0].score.player
                }
                onOpenModal={handleOpenModal}
                opponents={playViewModel.matches.map((match) => ({
                  displayName: match.players[1].score.player,
                  currentTotal: match.players[1].score.totalGross,
                  currentIn: match.players[1].score.in,
                  currentOut: match.players[1].score.out,
                  scores: match.players[1].score.scoreHoles,
                }))}
              />

              <MatchModal
                onNextHole={handleNextHole}
                onPrevHole={handlePreviousHole}
                hole={parseInt(playViewModel.holeModal)}
                par={parseInt(playViewModel.parModal)}
                onSetScore={onSetScore}
                players={playViewModel.allPlayers}
                isOpen={playViewModel.openModal}
                onCloseModal={handleCloseModal}
              />
              <ScoreBeforeLeave
                isOpen={openFinishModal}
                onCloseModal={handleCancel}
                isFull={isFull}
                onSubmit={
                  playViewModel.matches[0].match.winner !== ""
                    ? handleSubmit
                    : (message: string) => {
                        handleOnExit();
                        if (blocker.state === "blocked") {
                          blocker.reset();
                        }
                      }
                }
                title={
                  playViewModel.matches[0].match.winner !== ""
                    ? "POST SCORE"
                    : "EXIT ROUND"
                }
              >
                <React.Fragment>
                  {playViewModel.matches.map((match) => (
                    <HorizontalScoreCard
                      match={match}
                      hideMatch={hideMatch}
                      hideTeam={hideTeam}
                      hideMedal={hideMedal}
                      isSmall={true}
                    />
                  ))}
                </React.Fragment>
              </ScoreBeforeLeave>
              {blocker.state === "blocked" &&
              playViewModel.currentStep === 2 ? (
                <LeaveModal
                  isOpen={blocker.state === "blocked"}
                  onCloseModal={() => blocker.reset()}
                  onSubmit={() => blocker.proceed()}
                  title={
                    playViewModel.matches[0].match.winner !== ""
                      ? "POST SCORE"
                      : "EXIT ROUND"
                  }
                >
                  <React.Fragment>
                    {playViewModel.matches.map((match) => (
                      <HorizontalScoreCard
                        match={match}
                        hideMatch={hideMatch}
                        hideTeam={hideTeam}
                        hideMedal={hideMedal}
                        isSmall={true}
                      />
                    ))}
                  </React.Fragment>
                </LeaveModal>
              ) : null}
            </TabPanel>
          </React.Fragment>
        )}

        {showButton && (
          <Button
            sx={{ marginTop: "20px", minWidth: "250px" }}
            color="primary"
            variant="contained"
            size="large"
            onClick={onSaveHandler}
            disabled={isDisabledButton}
          >
            {submitButtonText[playViewModel.currentStep]}
          </Button>
        )}

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
        {/* {playViewModel.currentStep === 2 && (
          <Fab
            color="primary"
            variant="extended"
            disabled={playViewModel.currentTeeBox === ""}
            onClick={handleMail}
            sx={{
              position: "fixed",
              bottom: "16px",
              width: 250,
              left: "0",
            }}
          >
            Mock Results
          </Fab>
        )} */}
      </Box>
    </div>
  );
};

export default observer(Play);

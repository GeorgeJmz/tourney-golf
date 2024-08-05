import React, { useEffect, useMemo } from "react";
import UserViewModel from "../../../viewModels/UserViewModel";
import { observer } from "mobx-react";
import { Stack, Box, Typography, Button, Tabs, Tab } from "@mui/material";
import NewTheme from "../../../components/NewTheme/NewTheme";
import { useNavigate, useParams } from "react-router-dom";
import {
  invitationsMatch,
  invitationsFieldsValidations,
} from "../../../helpers/getTournamentFields";
import HeaderDashboard from "../../../components/HeaderDashboard/HeaderDashboard";
import { Link } from "react-router-dom";
import { URLS } from "../../../helpers/URLS";
import { convertDate } from "../../../helpers/convertDate";
import { GolfCourse } from "../../../services/courses";
import CourseList from "../../../components/CourseList/CourseList";
import PlayViewModel from "../../../viewModels/PlayViewModel";
import { OpponentInvitations } from "../../../components/OpponentInvitations";
import type { IUser } from "../../../models/User";
import type { ITournamentPlayer } from "../../../models/Player";
import { getPlayersByTournamentId } from "../../../services/firebase";
import { useBlocker } from "react-router-dom";
import ScoreCard from "../../../components/ScoreCard/ScoreCard";
import { ScoreTable } from "../../../components/ScoreTable";
import { ScoreModal } from "../../../components/ScoreModal";
import { PostScoreModal } from "../../../components/PostScoreModal";
import { LeaveModal } from "../../../components/LeaveModal";

interface IPlayLeagueProps {
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

export const PlayLeague: React.FC<IPlayLeagueProps> = observer(({ user }) => {
  const playViewModel = React.useMemo(() => new PlayViewModel(), []);
  const lastCourses = React.useMemo(() => user.user.lastCourses, []);
  const { id } = useParams();
  const [currentPlayer, setCurrentPlayer] = React.useState<ITournamentPlayer>();
  const [openFinishModal, setOpenFinishModal] = React.useState(false);
  const navigate = useNavigate();
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

  const onOpenCourse = (id: string) => {
    playViewModel.openCloseCourse(id);
  };

  const onSelectTeeBox = (course: GolfCourse, id: string) =>
    playViewModel.selectTeeBox(course, id);

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

  const onSaveHandler = () => {
    if (playViewModel.currentStep === 2) {
      setOpenFinishModal(true);
    } else {
      playViewModel.setCurrentStep(playViewModel.currentStep + 1);
    }
  };

  const getPlayersByConference = (conferenceId: string) => {
    const players = currentTournament?.playersList.filter(
      (player) =>
        player.conference === conferenceId &&
        !currentPlayer?.opponent?.includes(player.email || "")
    );
    return players;
  };
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

  const emailList = playViewModel.emailList;
  const validationSchema = invitationsFieldsValidations;
  const playersToInvite = React.useMemo(
    () => getPlayersByConference(findConferenceByEmail(user.user.email) || ""),
    [currentPlayer]
  );

  if (playViewModel.getAuthor() === "") {
    playViewModel.setAuthor(user);
  }
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [playViewModel.currentStep]);

  const [value, setValue] = React.useState(1);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
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

  const handleCloseModal = () => {
    playViewModel.setModal(false);
  };
  const handleOnExit = () => {
    setTimeout(() => navigate(URLS.DASHBOARD), 1);
  };

  const handleSubmit = (message: string) => {
    playViewModel.createMatch(message, () => navigate(URLS.DASHBOARD));
    // console.log("Finished");
    // setTimeout(() => navigate(URLS.DASHBOARD), 5000);
  };

  const isMobile = () =>
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  const handleCancel = () => {
    setOpenFinishModal(false);
  };

  const isFull = playViewModel.matches.length > 2 || isMobile();
  return (
    <React.Fragment>
      <NewTheme>
        <Box
          sx={(theme) => ({
            display: "flex",
            alignItems: "top",
            justifyContent: "space-around",
            minHeight: "100vh",
            paddingX: theme.spacing(3),
            maxWidth: "1280px",
            margin: "auto",
            marginTop: theme.spacing(6),
          })}
        >
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={3}
            sx={{ height: "100%", position: "relative", overflow: "auto" }}
          >
            <HeaderDashboard text={currentTournament?.name || ""} />

            <Box width="100%">
              {playViewModel.currentStep === 0 && (
                <Box width="100%" maxWidth="500px">
                  <Typography
                    variant="h5"
                    align="center"
                    sx={{
                      fontWeight: 700,
                      fontSize: "32px",
                      color: "white",
                      lineHeight: "36px",
                      textTransform: "uppercase",
                    }}
                  >
                    Golf Course
                  </Typography>
                  <CourseList
                    lastCourse={lastCourses}
                    courses={playViewModel.courses}
                    currentTeeBox={playViewModel.currentTeeBox}
                    onOpenCourse={onOpenCourse}
                    onSelectTeeBox={onSelectTeeBox}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    size="large"
                    disabled={isDisabledButton}
                    onClick={onSaveHandler}
                  >
                    Select Course
                  </Button>
                </Box>
              )}
              {playViewModel.currentStep === 1 && (
                <Box width="100%" maxWidth="500px">
                  <Typography
                    variant="h5"
                    align="center"
                    sx={{
                      fontWeight: 700,
                      fontSize: "32px",
                      color: "white",
                      lineHeight: "36px",
                      textTransform: "uppercase",
                    }}
                  >
                    Opponent
                  </Typography>
                  <OpponentInvitations
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
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    size="large"
                    disabled={isDisabledButton}
                    onClick={onSaveHandler}
                  >
                    Start Match
                  </Button>
                </Box>
              )}
              {playViewModel.currentStep === 2 && (
                <Box>
                  <React.Fragment>
                    <Tabs value={value} onChange={handleChange} centered>
                      <Tab label="Match" />
                      <Tab label="Score" />
                      <Tab label="Stakes" />
                    </Tabs>
                    <TabPanel value={value} index={0}>
                      <Box
                        sx={{
                          marginBottom: "50px",
                          marginTop: "50px",
                        }}
                      >
                        {playViewModel.matches.map((match) => (
                          <ScoreCard
                            match={match}
                            hideMatch={hideMatch}
                            hideTeam={hideTeam}
                            hideMedal={hideMedal}
                            isSmall={false}
                          />
                        ))}
                      </Box>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                      <ScoreTable
                        currentDistance={playViewModel.currentDistance}
                        currentTeeBoxDisplayName={
                          playViewModel.currentTeeBoxDisplayName
                        }
                        currentHcp={playViewModel.currentHcp}
                        currentPar={playViewModel.currentPar}
                        currentOut={
                          playViewModel.matches[0].players[0].score.out
                        }
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

                      <ScoreModal
                        onNextHole={handleNextHole}
                        onPrevHole={handlePreviousHole}
                        hole={parseInt(playViewModel.holeModal)}
                        par={parseInt(playViewModel.parModal)}
                        onSetScore={onSetScore}
                        players={playViewModel.allPlayers}
                        isOpen={playViewModel.openModal}
                        onCloseModal={handleCloseModal}
                      />
                      <PostScoreModal
                        isOpen={openFinishModal}
                        onCloseModal={handleCancel}
                        isFull={isFull}
                        pathName={currentTournament?.id || ""}
                        fileName={
                          `${currentTournament?.playersList[0].email}-${currentTournament?.playersList[1].email}` ||
                          ""
                        }
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
                            <ScoreCard
                              match={match}
                              hideMatch={hideMatch}
                              hideTeam={hideTeam}
                              hideMedal={hideMedal}
                              isSmall={true}
                            />
                          ))}
                        </React.Fragment>
                      </PostScoreModal>
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
                              <ScoreCard
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
                      <Button
                        fullWidth
                        variant="contained"
                        color="secondary"
                        size="large"
                        disabled={isDisabledButton}
                        onClick={onSaveHandler}
                        sx={{
                          maxWidth: "250px",
                        }}
                      >
                        End Match
                      </Button>
                    </TabPanel>
                  </React.Fragment>
                </Box>
              )}
            </Box>
          </Stack>
        </Box>
      </NewTheme>
    </React.Fragment>
  );
});

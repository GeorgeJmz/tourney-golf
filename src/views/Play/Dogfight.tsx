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
import { Button, Typography } from "@mui/material";
import { getPlayersByTournamentId } from "../../services/firebase";
import { ITournamentPlayer } from "../../models/Player";
import { ScoreBeforeLeave } from "./components/ScoreBeforeLeave";
import { LeaveModal } from "./components/LeaveModal";
import { useBlocker } from "react-router-dom";
import { toJS } from "mobx";
import { convertDate } from "../../helpers/convertDate";
import { DateInput } from "../../components/DateInput";
import dayjs from "dayjs";

interface IPlayDogfightProps {
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

const Dogfight: React.FC<IPlayDogfightProps> = ({ user }) => {
  const playViewModel = React.useMemo(() => new PlayViewModel(), []);
  const [currentPlayer, setCurrentPlayer] = React.useState<ITournamentPlayer>();
  const navigate = useNavigate();
  const { id } = useParams();
  const currentTournament = React.useMemo(
    () => user.activeTournaments.find((t) => t.id === id),
    []
  );

  const currentDate = convertDate(
    new Date().toDateString() || "",
    "MM/DD/YYYY"
  );

  const [fakeDate, setFakeDate] = React.useState(currentDate);

  const roundDates = currentTournament?.roundDates?.map((date) =>
    convertDate(date, "MM/DD/YYYY")
  );
  const champDate = currentTournament?.championshipRound
    ? [convertDate(currentTournament?.championshipDate || "", "MM/DD/YYYY")]
    : [];

  const currentRound = roundDates?.includes(
    convertDate(fakeDate || "", "MM/DD/YYYY")
  )
    ? roundDates?.indexOf(convertDate(fakeDate || "", "MM/DD/YYYY")) + 1
    : 0;

  const isChampionship =
    champDate?.includes(convertDate(fakeDate || "", "MM/DD/YYYY")) &&
    playViewModel.emailListPlayedRound.includes(user.user.email);
  const isRound =
    (roundDates?.includes(convertDate(fakeDate || "", "MM/DD/YYYY")) &&
      !playViewModel.emailListPlayedRound.includes(user.user.email)) ||
    isChampionship;

  useEffect(() => {
    playViewModel.checkIfRoundPlayed(currentRound, currentPlayer?.email || "");
  }, [currentRound, currentPlayer]);
  console.log("emailListPlayedRound", toJS(playViewModel.emailListPlayedRound));
  const lastCourses = React.useMemo(() => user.user.lastCourses, []);

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

  const playersToInvite = React.useMemo(
    () => currentTournament?.playersList,
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

    return false;
  }, [numberOfPlayers, playViewModel.currentTeeBox, playViewModel.currentStep]);

  const [openFinishModal, setOpenFinishModal] = React.useState(false);

  const onSaveHandler = () => {
    if (playViewModel.currentStep === 2) {
      setOpenFinishModal(true);
    } else {
      playViewModel.setCurrentStep(playViewModel.currentStep + 1);
      console.log(toJS(playViewModel));
    }
  };
  const validationSchema = invitationsFieldsValidations;
  const emailList = playViewModel.emailList;
  const onSubmitHandler = (email: string, name: string, handicap: number) => {
    console.log(toJS(playViewModel.allPlayers));
    if (
      !playViewModel.allPlayers.find(
        (player) => player.score.idPlayer === email
      )
    ) {
      playViewModel.addEmailToList(email, name, handicap);
    }
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
  const submitButtonText = ["Choose course", "Start Round", "End Round"];

  const [value, setValue] = React.useState(1);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleSubmit = (message: string) => {
    console.log("Finished");
    const round = roundDates?.includes(
      convertDate(fakeDate || "", "MM/DD/YYYY")
    )
      ? roundDates?.indexOf(convertDate(fakeDate || "", "MM/DD/YYYY")) + 1
      : 0;
    playViewModel.createRound(message, round, () => navigate("/dashboard"));
    // setTimeout(() => navigate("/dashboard"), 5000);
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
  const isDevelopment = !window.location.href.includes("teeboxleague.com");
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [playViewModel.currentStep]);
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
        {isDevelopment && (
          <DateInput
            inputElement={{
              input: "date",
              name: "date",
              placeholder: "Date",
              size: { xs: 12, md: 12, lg: 12 },
            }}
            isError={false}
            onChange={(value: string | null) => {
              setFakeDate(dayjs(value).format());
            }}
            value={fakeDate as unknown as string}
            error={undefined}
          />
        )}
        {playViewModel.currentStep === 0 && isRound && (
          <CourseList
            lastCourse={lastCourses}
            courses={playViewModel.courses}
            currentTeeBox={playViewModel.currentTeeBox}
            onOpenCourse={onOpenCourse}
            onSelectTeeBox={onSelectTeeBox}
          />
        )}
        {playViewModel.currentStep === 1 && isRound && (
          <Invitations
            showAll={false}
            playersToInvite={
              (playersToInvite?.filter((player) =>
                isChampionship
                  ? player?.email !== user.user.email &&
                    playViewModel.emailListPlayedRound.includes(
                      player?.email || ""
                    )
                  : player?.email !== user.user.email &&
                    !playViewModel.emailListPlayedRound.includes(
                      player?.email || ""
                    )
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
        {playViewModel.currentStep === 2 && isRound && (
          <React.Fragment>
            <Tabs value={value} onChange={handleChange} centered>
              <Tab label="Round" />
              <Tab label="Score" />
              <Tab label="Stakes" />
            </Tabs>
            <TabPanel value={value} index={0}>
              <React.Fragment>
                {playViewModel.matches.map((match) => (
                  <HorizontalScoreCard
                    match={match}
                    hideMatch
                    hideTeam
                    hideMedal
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
                opponents={playViewModel.matches[0].players
                  .filter((val, index) => index !== 0)
                  .reverse()
                  .map((player) => ({
                    displayName: player.score.player,
                    currentTotal: player.score.totalGross,
                    currentIn: player.score.in,
                    currentOut: player.score.out,
                    scores: player.score.scoreHoles,
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
        {showButton && isRound && (
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
        {!isRound && (
          <Box>
            <h1>There are no rounds for today</h1>
            <Box>{fakeDate} - fakeDate</Box>
            {roundDates?.map((date, index) => (
              <Typography>
                Round {index + 1} - {date}
              </Typography>
            ))}
            <Typography>Championship Round {champDate}</Typography>
          </Box>
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

export default observer(Dogfight);

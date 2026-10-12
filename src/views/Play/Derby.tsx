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
import {
  Button,
  Typography,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { getPlayersByTournamentId } from "../../services/firebase";
import { ITournamentPlayer } from "../../models/Player";
import { ScoreBeforeLeave } from "./components/ScoreBeforeLeave";
import { LeaveModal } from "./components/LeaveModal";
import { useBlocker } from "react-router-dom";
import { convertDate } from "../../helpers/convertDate";
import { DateInput } from "../../components/DateInput";
import dayjs from "dayjs";

interface IDerbyProps {
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

const Derby: React.FC<IDerbyProps> = ({ user }) => {
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

  // Validar si estamos dentro de un round
  let isInRound = false;
  let currentRound = 0;
  // Derby usa roundDates como array de objetos con start/end (rangos)
  const roundDatesAsRanges = currentTournament?.roundDates as unknown as {
    start: string;
    end: string;
  }[];
  
  roundDatesAsRanges?.forEach((date, index) => {
    const dateConvertedStart = convertDate(date.start, "MM/DD/YYYY");
    const dateConvertedEnd = convertDate(date.end, "MM/DD/YYYY");
    const dateConvertedFake = convertDate(fakeDate || "", "MM/DD/YYYY");
    if (
      dateConvertedFake >= dateConvertedStart &&
      dateConvertedFake <= dateConvertedEnd
    ) {
      isInRound = true;
      currentRound = index + 1;
    }
  });

  // Formatear rounds para mostrar
  const roundDatesFormatted = roundDatesAsRanges?.map(
    (date) =>
      `${convertDate(date.start, "MM/DD/YYYY")} - ${convertDate(
        date.end,
        "MM/DD/YYYY"
      )}`
  );

  // Championship Round
  let isChampionshipRound = false;
  currentTournament?.championshipRound &&
    currentTournament?.championshipDate &&
    (isChampionshipRound =
      convertDate(currentTournament?.championshipDate, "MM/DD/YYYY") ===
      convertDate(fakeDate || "", "MM/DD/YYYY"));

  // Determinar si puede jugar hoy
  const canPlayToday = playViewModel.emailListPlayedRound.includes(
    user.user.email
  );
  const isRound = (isInRound || isChampionshipRound) && !canPlayToday;

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

  useEffect(() => {
    // Derby permite jugar una vez por día, no una vez por etapa
    // Siempre verificar si el jugador ya jugó HOY (no solo en el round)
    playViewModel.checkIfCanPlayToday(
      fakeDate || "",
      currentPlayer?.email || ""
    );
  }, [currentRound, currentPlayer, isChampionshipRound, fakeDate]);

  const playType = currentTournament?.playType;
  const hideMatch = playType === "strokePlay";
  const hideMedal = playType === "matchPlay";

  const playersToInvite = React.useMemo(
    () => currentTournament?.playersList,
    [currentPlayer]
  );

  if (playViewModel.getAuthor() === "") {
    playViewModel.setAuthor(user);
  }

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
  const submitButtonText = ["Choose course", "Start Round", "End Round"];

  const [value, setValue] = React.useState(1);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleSubmit = (message: string) => {
    const playOffsDetail = currentTournament?.playOffsDetail;
    if (playOffsDetail && playOffsDetail.players > 0) {
      playViewModel.createMatchPlayoffs(message, () => navigate("/dashboard"));
    } else {
      playViewModel.createRound(message, currentRound, () => navigate("/dashboard"));
    }
    // console.log("Finished");
    // setTimeout(() => navigate("/dashboard"), 5000);
  };

  const handleOnExit = () => {
    setTimeout(() => navigate("/dashboard"), 1);
  };

  const handleCancel = () => {
    setOpenFinishModal(false);
  };
  const showButton = !(playViewModel.currentStep === 2 && value !== 1);

  const isDevelopment = !window.location.href.includes("teeboxleague.com");

  const isMobile = () =>
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

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
                isChampionshipRound
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
            {/* Header con información del campo - Siempre visible */}
            {playViewModel.matches.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          align="center"
                          sx={{
                            backgroundColor: "#4CAF50",
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "18px",
                            padding: "16px",
                            border: "none",
                          }}
                        >
                          {playViewModel.matches[0].match.courseDisplayName} -{" "}
                          {playViewModel.matches[0].match.teeBoxDisplayName}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                  </Table>
                </TableContainer>
              </Box>
            )}

            <Tabs value={value} onChange={handleChange} centered>
              <Tab label="Round" />
              <Tab label="Score" />
              {/* <Tab label="Stakes" /> */}
            </Tabs>
            <TabPanel value={value} index={0}>
              <React.Fragment>
                {playViewModel.matches.map((match, index) => (
                  <HorizontalScoreCard
                    key={`match-${index}`}
                    match={match}
                    hideMatch
                    hideTeam={true}
                    hideMedal
                    isSmall={false}
                    hideWinner
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
                opponents={playViewModel.matches.flatMap((match) =>
                  match.players
                    .filter((val, index) => index !== 0)
                    .map((player) => ({
                      displayName: player.score.player,
                      currentTotal: player.score.totalGross,
                      currentIn: player.score.in,
                      currentOut: player.score.out,
                      scores: player.score.scoreHoles,
                    }))
                )}
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
                    : () => {
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
                  {playViewModel.matches.map((match, index) => (
                    <HorizontalScoreCard
                      key={`modal-match-${index}`}
                      match={match}
                      hideMatch={hideMatch}
                      hideTeam={true}
                      hideMedal={hideMedal}
                      isSmall={true}
                      hideWinner
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
                    {playViewModel.matches.map((match, index) => (
                      <HorizontalScoreCard
                        key={`leave-modal-match-${index}`}
                        match={match}
                        hideMatch={hideMatch}
                        hideTeam={true}
                        hideMedal={hideMedal}
                        isSmall={true}
                        hideWinner
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
        {!isRound && (
          <Box>
            <h1>No hay rounds disponibles para hoy</h1>
            <Box>{fakeDate} - Fecha actual</Box>
            {roundDatesFormatted?.map((date, index) => (
              <Typography key={index}>
                Round {index + 1} - {date}
              </Typography>
            ))}
            {currentTournament?.championshipRound && (
              <Typography>
                Championship Round -{" "}
                {convertDate(
                  currentTournament?.championshipDate || "",
                  "MM/DD/YYYY"
                )}
              </Typography>
            )}
            {canPlayToday && (
              <Typography sx={{ mt: 2, color: "warning.main" }}>
                Ya has jugado el round de hoy
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </div>
  );
};

export default observer(Derby);

import * as React from "react";
import { observer } from "mobx-react";
import UserViewModel from "../../viewModels/UserViewModel";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TournamentViewModel from "../../viewModels/TournamentViewModel";

import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";

import {
  Box,
  FormControl,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ManageTournament from "../ManageTournament/ManageTournament";
import { convertMomentDate, differenceDate } from "../../helpers/convertDate";
import MenuItems from "../../components/MenuItems";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { set, toJS } from "mobx";
import { IPlayer } from "../../models/Tournament";
import { getMessages } from "../../helpers/getMessages";
import { toast } from "react-toastify";
import { Messages } from "../../helpers/messages";
import RoundReviewDogfight from "../../components/RoundReviewDogfight";
import PLayOffs from "../PlayOffs/PlayOffs";
import { TextInput } from "../../components/TextInput";
import RoundReviewTeamPlay from "../../components/RoundReviewTeamPlay";

interface IAdminLeagueProps {
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

const headerStyles = {
  border: 0,
  textAlign: "center",
  backgroundColor: "Green",
  color: "white",
  fontWeight: "bold",
};
const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const AdminLeague: React.FC<IAdminLeagueProps> = ({ user }) => {
  const userId = React.useMemo(() => user.getUserId(), []);

  const [value, setValue] = React.useState(0);
  const [newLeagueName, setNewLeagueName] = React.useState("");
  const [newChampion, setNewChampion] = React.useState("");
  const [userStats, setUserStats] = React.useState("");
  const [rowChanged, setRowChanged] = React.useState<Array<string>>([]);
  const navigate = useNavigate();

  const tournamentViewModel = React.useMemo(
    () => new TournamentViewModel(),
    []
  );
  const { id } = useParams();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const currentTournament = React.useMemo(
    () => user.activeTournaments.find((t) => t.id === id),
    []
  );
  if (id) {
    tournamentViewModel.setTournamentId(id);
  }
  if (currentTournament && tournamentViewModel.author === "") {
    tournamentViewModel.setTournament(currentTournament);
    setNewLeagueName(currentTournament.name);
    setNewChampion(currentTournament.champion || "");
    tournamentViewModel.setAuthor(userId);
  }

  React.useEffect(() => {
    if (id) {
      tournamentViewModel.getAllMatchesResultsByTournament();
    }
  }, [id]);

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    let currentChanges = "";
    const changes: { [key: string]: { [key: string]: string } } = {};
    formData.forEach((value, key) => {
      if (key === "id") {
        currentChanges = value.toString();
      } else {
        changes[currentChanges] = {
          ...changes[currentChanges],
          [key]: value.toString(),
        };
      }
    });
    tournamentViewModel.updatePlayersAndMatches(changes);
    setTimeout(() => navigate("/dashboard"), 1000);
  };

  const handleUpdateRow = (newId: string) => {
    setRowChanged((prev) => {
      const previous = [...new Set([...prev, newId])];
      return previous;
    });
  };

  const sendEmail = () => {
    tournamentViewModel.sendEmail();
  };

  React.useEffect(() => {
    if (tournamentViewModel.leagueResults.length > 0) {
      setUserStats(tournamentViewModel.playersResultsOptions[0].value);
    }
  }, [tournamentViewModel.leagueResults]);

  const playType = currentTournament?.playType;
  const tournamentType = currentTournament?.tournamentType;

  const hideTeam =
    tournamentType !== "leagueteamplay" && tournamentType !== "teamplay";
  const hideMatch =
    playType !== "matchPlay" &&
    playType !== "matchstrokePlay" &&
    playType !== "matchplaystableford" &&
    playType !== "matchmedalplaystableford";
  const hideMedal =
    playType !== "strokePlay" &&
    playType !== "matchstrokePlay" &&
    playType !== "stableford" &&
    playType !== "medalplaystableford" &&
    playType !== "matchmedalplaystableford";

  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [openSwitchModal, setOpenSwitchModal] = React.useState(false);
  const [matchToDelete, setMatchToDelete] = React.useState<string>("");
  const [playerToSwitch, setPlayerToSwitch] =
    React.useState<null | Partial<IPlayer>>(null);

  const onDeleteMatch = (id: string) => {
    setMatchToDelete(id);
    setOpenDeleteModal(true);
  };

  const onDeleteRound = (idRound: string, idPlayer: string) => {
    setMatchToDelete(`${idRound}-${idPlayer}`);
    setOpenDeleteModal(true);
  };

  const onChangeDate = (idRound: string, newDate: string) => {
    tournamentViewModel.changeMatchDate(idRound, newDate);
  };
  const onDeleteMatchConfirm = () => {
    !isDogfight
      ? isTeamPlay
        ? tournamentViewModel.removePlayerFromMatch(
            matchToDelete.split("-")[0],
            matchToDelete.split("-")[1]
          )
        : tournamentViewModel.deleteMatch(matchToDelete)
      : tournamentViewModel.deleteRound(
          matchToDelete.split("-")[0],
          matchToDelete.split("-")[1]
        );
    setTimeout(() => navigate("/dashboard"), 1200);
    setOpenDeleteModal(false);
  };

  const onSwitchPlayer = async () => {
    const displayLoading = getMessages(Messages.LOADING);
    const cuToast = toast.loading(displayLoading);
    await tournamentViewModel.switchPlayer(
      playerToSwitch?.prevEmail || "",
      playerToSwitch?.email || "",
      playerToSwitch?.name || ""
    );
    toast.dismiss(cuToast);
    setTimeout(() => {
      navigate("/dashboard");
    }, 1200);
  };

  const hasDuplicate = () => {
    const emails = tournamentViewModel.tournament.playersList.map(
      (p) => p.email
    );
    return emails.includes(playerToSwitch?.email || "");
  };

  const isDogfight = tournamentType === "dogfight";
  const isDraft = tournamentType === undefined;
  const getCurrentPlayer = () => {
    return tournamentViewModel.leagueResults
      .filter((result) =>
        result.matchResults.find((m) => m.idPlayer === userStats)
      )
      .sort((a, b) => (a?.round ?? 0) - (b?.round ?? 0));
  };

  const isTeamPlay = tournamentType === "teamplay";
  const displayPlayoffs = isDogfight || isDraft || isTeamPlay;
  const fieldText = isTeamPlay ? "Champion Team Name" : "Champion's Name";
  const finishLeagueText = isTeamPlay
    ? "All players will see the league taken off from League Action and find Results and Leaderboards in their League History as view only."
    : "All players will see the league taken off from League Action and find Results, Leaderboard and Playoff Bracket in their League History as view only.";

  const modalText = isTeamPlay
    ? "Remove Score ?"
    : !isDogfight
    ? tournamentViewModel.leagueResults
        .find((m) => m.id === matchToDelete)
        ?.matchResults.map((p) => p.playerName)
        .join(" vs ") || ""
    : `Round ${
        tournamentViewModel.leagueResults.find(
          (m) => m.id === matchToDelete.split("-")[0]
        )?.round || ""
      } - ${
        tournamentViewModel.leagueResults
          .find((m) => m.id === matchToDelete.split("-")[0])
          ?.matchResults.find((p) => p.idPlayer === matchToDelete.split("-")[1])
          ?.playerName || ""
      }`;
  const modalTitle = isTeamPlay
    ? tournamentViewModel.leagueResults
        .find((m) => m.id === matchToDelete.split("-")[0])
        ?.matchResults.find((i) => i.idPlayer === matchToDelete.split("-")[1])
        ?.playerName
    : `Delete ${!isDogfight ? "match" : "round"} ?`;

  const isTeamPlayResults = isTeamPlay
    ? [...tournamentViewModel.leagueResults].sort((a, b) =>
        differenceDate(a.date, b.date)
      )
    : [];

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
        <React.Fragment>
          <Tabs value={value} onChange={handleChange} centered>
            <Tab label="League Setup" value={0} />
            {isDogfight ? (
              <Tab label="Round Review " value={1} />
            ) : isDraft ? null : (
              <Tab label="Results Review " value={1} />
            )}
            {isDogfight || isDraft ? null : (
              <Tab label="Switch Players " value={2} />
            )}
            {displayPlayoffs ? null : (
              <Tab label="Playoff Picture " value={3} />
            )}
            <Tab label="Finish League" value={4} />
          </Tabs>
          <TabPanel value={value} index={0}>
            <React.Fragment>
              <ManageTournament user={user} />
            </React.Fragment>
          </TabPanel>
          <TabPanel value={value} index={1}>
            {isDogfight ? (
              <RoundReviewDogfight
                leagueResults={tournamentViewModel.leagueResults}
                onDeleteRound={onDeleteRound}
                playersResultsOptions={
                  tournamentViewModel.playersResultsOptions
                }
              />
            ) : isTeamPlay ? (
              <RoundReviewTeamPlay
                leagueResults={isTeamPlayResults}
                onChangeDate={onChangeDate}
                onRemovePlayer={onDeleteRound}
              />
            ) : (
              // <Box alignContent="center">
              //   <form onSubmit={onSubmit}>
              //     <TableContainer component={Box}>
              //       <Table>
              //         <TableHead>
              //           <TableRow>
              //             <TableCell sx={headerStyles}>Round</TableCell>
              //             <TableCell sx={headerStyles}>
              //               <MenuItems
              //                 noFirstOption
              //                 options={
              //                   tournamentViewModel.playersResultsOptions
              //                 }
              //                 placeholder="All Matches"
              //                 onChange={(e) => {
              //                   setRowChanged([]);
              //                   setUserStats(e);
              //                 }}
              //                 isActive={true}
              //               />
              //             </TableCell>
              //             <TableCell sx={headerStyles}>Gross</TableCell>
              //             <TableCell sx={headerStyles}>HDCP</TableCell>
              //             <TableCell sx={headerStyles}>Net</TableCell>
              //             <TableCell sx={headerStyles}></TableCell>
              //           </TableRow>
              //         </TableHead>
              //         <TableBody>
              //           {getCurrentPlayer().map((match) => (
              //             <TableRow key={match.id}>
              //               <TableCell
              //                 sx={{ textAlign: "center", minWidth: "80px" }}
              //               >
              //                 <TextField
              //                   size="small"
              //                   type="hidden"
              //                   name="id"
              //                   sx={{ display: "none" }}
              //                   defaultValue={
              //                     match.matchResults[0].idPlayer +
              //                     "-" +
              //                     match.matchResults[1].idPlayer
              //                   }
              //                 />{" "}
              //                 {match.round}
              //               </TableCell>
              //               <TableCell
              //                 sx={{ textAlign: "center", minWidth: "80px" }}
              //               >
              //                 {
              //                   match.matchResults.find(
              //                     (player) => player.idPlayer === userStats
              //                   )?.playerName
              //                 }{" "}
              //                 <br />{" "}
              //               </TableCell>

              //               <TableCell
              //                 sx={{ textAlign: "center", minWidth: "80px" }}
              //               >
              //                 <p style={{ margin: 0 }}>
              //                   {
              //                     match.matchResults.find(
              //                       (player) => player.idPlayer === userStats
              //                     )?.gross
              //                   }
              //                 </p>
              //               </TableCell>
              //               <TableCell
              //                 sx={{ textAlign: "center", minWidth: "80px" }}
              //               >
              //                 <p style={{ margin: 0 }}>
              //                   {
              //                     match.matchResults.find(
              //                       (player) => player.idPlayer === userStats
              //                     )?.hcp
              //                   }
              //                 </p>
              //               </TableCell>
              //               <TableCell
              //                 sx={{ textAlign: "center", minWidth: "80px" }}
              //               >
              //                 <p style={{ margin: 0 }}>
              //                   {
              //                     match.matchResults.find(
              //                       (player) => player.idPlayer === userStats
              //                     )?.score
              //                   }
              //                 </p>
              //               </TableCell>
              //               <TableCell
              //                 sx={{ textAlign: "center", minWidth: "80px" }}
              //               >
              //                 <IconButton
              //                   aria-label="delete"
              //                   onClick={() => onDeleteMatch(match.id || "")}
              //                 >
              //                   <DeleteIcon />
              //                 </IconButton>
              //               </TableCell>
              //             </TableRow>
              //           ))}
              //         </TableBody>
              //       </Table>
              //     </TableContainer>
              //   </form>
              // </Box>
              <form onSubmit={onSubmit}>
                <TableContainer component={Box}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={headerStyles}>Date</TableCell>
                        <TableCell sx={headerStyles}>
                          <MenuItems
                            noFirstOption
                            options={tournamentViewModel.playersResultsOptions}
                            placeholder="All Matches"
                            onChange={(e) => {
                              setRowChanged([]);
                              setUserStats(e);
                            }}
                            isActive={true}
                          />
                        </TableCell>
                        {!hideMatch && (
                          <TableCell sx={headerStyles}>Match Points</TableCell>
                        )}
                        {!hideMedal && (
                          <TableCell sx={headerStyles}>Medal Points</TableCell>
                        )}
                        {!hideTeam && (
                          <TableCell sx={headerStyles}>Team Points</TableCell>
                        )}
                        <TableCell sx={headerStyles}>Bonus +/-</TableCell>
                        <TableCell sx={headerStyles}>Gross</TableCell>
                        <TableCell sx={headerStyles}>HDCP</TableCell>
                        <TableCell sx={headerStyles}>Net</TableCell>
                        <TableCell sx={headerStyles}></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tournamentViewModel.leagueResults
                        .filter(
                          (result) =>
                            result.matchResults[0]?.idPlayer === userStats ||
                            result.matchResults[1]?.idPlayer === userStats
                        )
                        .sort((a, b) => differenceDate(a.date, b.date))
                        .map((match) => (
                          <TableRow key={match.id}>
                            <TableCell
                              sx={{ textAlign: "center", minWidth: "80px" }}
                            >
                              <TextField
                                size="small"
                                type="hidden"
                                name="id"
                                sx={{ display: "none" }}
                                defaultValue={
                                  match.matchResults[0]?.idPlayer +
                                  "-" +
                                  match.matchResults[1]?.idPlayer
                                }
                              />{" "}
                              {convertMomentDate(match.date)}{" "}
                            </TableCell>
                            <TableCell
                              sx={{ textAlign: "center", minWidth: "80px" }}
                            >
                              {match.matchResults[0]?.playerName} <br />{" "}
                              {match.matchResults[1]?.playerName}
                            </TableCell>
                            {!hideMatch && (
                              <TableCell
                                sx={{ textAlign: "center", minWidth: "80px" }}
                              >
                                <TextField
                                  size="small"
                                  type="text"
                                  name="matchpoints1"
                                  defaultValue={
                                    match.matchResults[0]?.matchPoints
                                  }
                                  onChange={() =>
                                    handleUpdateRow(
                                      match.matchResults[0]?.idPlayer +
                                        "-" +
                                        match.matchResults[1]?.idPlayer
                                    )
                                  }
                                />{" "}
                                <br />{" "}
                                <TextField
                                  size="small"
                                  type="text"
                                  name="matchpoints2"
                                  defaultValue={
                                    match.matchResults[1]?.matchPoints
                                  }
                                  onChange={() =>
                                    handleUpdateRow(
                                      match.matchResults[0]?.idPlayer +
                                        "-" +
                                        match.matchResults[1]?.idPlayer
                                    )
                                  }
                                />{" "}
                              </TableCell>
                            )}
                            {!hideMedal && (
                              <TableCell
                                sx={{ textAlign: "center", minWidth: "80px" }}
                              >
                                <TextField
                                  size="small"
                                  type="text"
                                  name="medalPoints1"
                                  defaultValue={
                                    match.matchResults[0].medalPoints
                                  }
                                  onChange={() =>
                                    handleUpdateRow(
                                      match.matchResults[0]?.idPlayer +
                                        "-" +
                                        match.matchResults[1]?.idPlayer
                                    )
                                  }
                                />{" "}
                                <br />{" "}
                                <TextField
                                  size="small"
                                  type="text"
                                  name="medalPoints2"
                                  defaultValue={
                                    match.matchResults[1]?.medalPoints
                                  }
                                  onChange={() =>
                                    handleUpdateRow(
                                      match.matchResults[0]?.idPlayer +
                                        "-" +
                                        match.matchResults[1]?.idPlayer
                                    )
                                  }
                                />{" "}
                              </TableCell>
                            )}
                            {!hideTeam && (
                              <TableCell
                                sx={{ textAlign: "center", minWidth: "80px" }}
                              >
                                <TextField
                                  size="small"
                                  type="text"
                                  name="teampoints1"
                                  defaultValue={
                                    match.matchResults[0]?.teamPoints
                                  }
                                  onChange={() =>
                                    handleUpdateRow(
                                      match.matchResults[0]?.idPlayer +
                                        "-" +
                                        match.matchResults[1]?.idPlayer
                                    )
                                  }
                                />{" "}
                                <br />{" "}
                                <TextField
                                  size="small"
                                  type="text"
                                  name="teampoints2"
                                  defaultValue={
                                    match.matchResults[1]?.teamPoints
                                  }
                                  onChange={() =>
                                    handleUpdateRow(
                                      match.matchResults[0]?.idPlayer +
                                        "-" +
                                        match.matchResults[1]?.idPlayer
                                    )
                                  }
                                />{" "}
                              </TableCell>
                            )}
                            <TableCell
                              sx={{ textAlign: "center", minWidth: "80px" }}
                            >
                              <TextField
                                size="small"
                                type="text"
                                name="bonuspoints1"
                                defaultValue={
                                  match.matchResults[0]?.bonusPoints
                                }
                                onChange={() =>
                                  handleUpdateRow(
                                    match.matchResults[0]?.idPlayer +
                                      "-" +
                                      match.matchResults[1]?.idPlayer
                                  )
                                }
                              />{" "}
                              <br />{" "}
                              <TextField
                                size="small"
                                type="text"
                                name="bonuspoints2"
                                defaultValue={
                                  match.matchResults[1]?.bonusPoints
                                }
                                onChange={() =>
                                  handleUpdateRow(
                                    match.matchResults[0]?.idPlayer +
                                      "-" +
                                      match.matchResults[1]?.idPlayer
                                  )
                                }
                              />{" "}
                            </TableCell>
                            <TableCell
                              sx={{ textAlign: "center", minWidth: "80px" }}
                            >
                              <p style={{ margin: 0 }}>
                                {match.matchResults[0]?.gross}
                              </p>
                              <br />{" "}
                              <p style={{ margin: 0 }}>
                                {match.matchResults[1]?.gross}
                              </p>
                            </TableCell>
                            <TableCell
                              sx={{ textAlign: "center", minWidth: "80px" }}
                            >
                              <p style={{ margin: 0 }}>
                                {match.matchResults[0]?.hcp}
                              </p>
                              <br />{" "}
                              <p style={{ margin: 0 }}>
                                {match.matchResults[1]?.hcp}
                              </p>
                            </TableCell>
                            <TableCell
                              sx={{ textAlign: "center", minWidth: "80px" }}
                            >
                              <p style={{ margin: 0 }}>
                                {match.matchResults[0]?.score}
                              </p>
                              <br />{" "}
                              <p style={{ margin: 0 }}>
                                {match.matchResults[1]?.score}
                              </p>
                            </TableCell>
                            <TableCell
                              sx={{ textAlign: "center", minWidth: "80px" }}
                            >
                              <IconButton
                                aria-label="delete"
                                onClick={() => onDeleteMatch(match.id || "")}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          sx={{ textAlign: "center", minWidth: "80px" }}
                        >
                          <Button
                            variant="contained"
                            type="submit"
                            disabled={rowChanged.length === 0}
                          >
                            Update
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </form>
            )}
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} justifyContent="center" alignItems="center">
                <TableContainer component={Paper}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">Name</TableCell>
                        <TableCell align="left">Email</TableCell>
                        <TableCell align="right"></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tournamentViewModel.tournament.playersList.map(
                        ({ email, name }, index) => (
                          <TableRow key={`${email}-${name}-${index}`}>
                            <TableCell component="th" scope="row" align="left">
                              {name}
                            </TableCell>
                            <TableCell align="left">{email}</TableCell>
                            <TableCell align="right">
                              <Button
                                variant="outlined"
                                endIcon={<SwitchAccountIcon />}
                                type="button"
                                onClick={() => {
                                  setPlayerToSwitch({
                                    email,
                                    name,
                                    prevEmail: email,
                                  });
                                  setOpenSwitchModal(true);
                                }}
                              >
                                Switch Player
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={3}>
            <PLayOffs tournamentViewModel={tournamentViewModel} />
          </TabPanel>
          <TabPanel value={value} index={4}>
            <p>
              Once
              <strong> {currentTournament?.name}</strong> has concluded, confirm
              the following information:
            </p>
            <p>
              <TextInput
                inputElement={{
                  name: "name",
                  placeholder:
                    "Confirm League's Name as it will be saved in League History",
                  input: "text",
                  size: {
                    xs: 12,
                    md: 12,
                    lg: 6,
                  },
                }}
                isError={false}
                error=""
                onChangeHandler={(e) => setNewLeagueName(e.target.value)}
                isDisabled={false}
                value={newLeagueName}
              />
            </p>
            <p>
              <TextInput
                inputElement={{
                  name: "champion",
                  placeholder: fieldText,
                  input: "text",
                  size: {
                    xs: 12,
                    md: 12,
                    lg: 6,
                  },
                }}
                isError={false}
                error=""
                onChangeHandler={(e) => setNewChampion(e.target.value)}
                isDisabled={false}
                value={newChampion}
              />
            </p>
            <p>This league will be permanently removed from your Admin tab.</p>
            <p>{finishLeagueText}</p>
            <Button
              variant="contained"
              type="button"
              onClick={() =>
                tournamentViewModel.finishLeague(newLeagueName, newChampion)
              }
            >
              Save & Finish League
            </Button>
            <Box sx={{ marginTop: "100px" }}>
              <p>
                Click here to delete <strong>{currentTournament?.name}</strong>
              </p>
              <p>Setup, Scores and Stats will be permanently lost</p>
              <Button
                variant="contained"
                type="button"
                color="error"
                onClick={() => tournamentViewModel.deleteLeague()}
              >
                Delete League
              </Button>
            </Box>
          </TabPanel>
          <Dialog
            open={openDeleteModal}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => setOpenDeleteModal(false)}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle>{modalTitle}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                <Typography variant="h6" textAlign="center">
                  {modalText}
                </Typography>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Box display="flex" gap="8px" alignContent="space-between">
                <Button onClick={() => onDeleteMatchConfirm()}>Yes</Button>
                <Button onClick={() => setOpenDeleteModal(false)}>No</Button>
              </Box>
            </DialogActions>
          </Dialog>
          <Dialog
            open={openSwitchModal}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => {
              setOpenSwitchModal(false);
              setPlayerToSwitch(null);
            }}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle>New Player Information</DialogTitle>
            <DialogContent>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <FormControl margin="normal" fullWidth>
                  <Box display="flex" gap="8px">
                    <TextField
                      size="small"
                      type="text"
                      variant="outlined"
                      placeholder="Name"
                      name="nameSwitch"
                      value={playerToSwitch?.name}
                      defaultValue={playerToSwitch?.name}
                      onChange={(e) =>
                        setPlayerToSwitch({
                          ...playerToSwitch,
                          name: e.target.value,
                        })
                      }
                    />
                    <TextField
                      size="small"
                      type="text"
                      variant="outlined"
                      placeholder="Email"
                      defaultValue={playerToSwitch?.email}
                      name="emailSwitch"
                      value={playerToSwitch?.email}
                      onChange={(e) =>
                        setPlayerToSwitch({
                          ...playerToSwitch,
                          email: e.target.value,
                        })
                      }
                    />
                  </Box>
                </FormControl>
              </Box>
            </DialogContent>
            <DialogActions>
              <Box display="flex" gap="8px" alignContent="space-between">
                <Button disabled={hasDuplicate()} onClick={onSwitchPlayer}>
                  Update
                </Button>
                <Button
                  onClick={() => {
                    setPlayerToSwitch(null);
                    setOpenSwitchModal(false);
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      </Box>
    </div>
  );
};
export default observer(AdminLeague);

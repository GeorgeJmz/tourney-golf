import * as React from "react";
import { observer } from "mobx-react";
import UserViewModel from "../../viewModels/UserViewModel";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TournamentViewModel from "../../viewModels/TournamentViewModel";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "@mui/material/Modal";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
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
import TourneySetup from "./../CreateTournament/components/CreateTournament/TourneySetup";
import RulesSetup from "./../CreateTournament/components/CreateTournament/RulesSetup";
import PlayerSetup from "./../CreateTournament/components/CreateTournament/PlayerSetup";
import GroupsSetup from "./../CreateTournament/components/CreateTournament/GroupsSetup";
import ConferenceSetup from "./../CreateTournament/components/CreateTournament/ConferenceSetup";
import TeamSetup from "./../CreateTournament/components/CreateTournament/TeamSetup";
import CalendarsSetup from "./../CreateTournament/components/CreateTournament/CalendarsSetup";
import { useNavigate } from "react-router-dom";
import ManageTournament from "../ManageTournament/ManageTournament";
import { set } from "firebase/database";
import { convertMomentDate, differenceDate } from "../../helpers/convertDate";
import { IMatchResults } from "../../models/Match";
import MenuItems from "../../components/MenuItems";
import { toJS } from "mobx";

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
const AdminLeague: React.FC<IAdminLeagueProps> = ({ user }) => {
  const userId = React.useMemo(() => user.getUserId(), []);

  const [value, setValue] = React.useState(0);
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
  const hideMatch = playType !== "matchPlay" && playType !== "matchstrokePlay";
  const hideMedal =
    playType !== "strokePlay" &&
    playType !== "matchstrokePlay" &&
    playType !== "stableford";

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
            <Tab label="League Setup" />
            <Tab label="Results Review " />
            <Tab label="Playoff Picture " />
            <Tab label="Finish League" />
            <Tab label="Delete League" />
          </Tabs>
          <TabPanel value={value} index={0}>
            <React.Fragment>
              <ManageTournament user={user} />
            </React.Fragment>
          </TabPanel>
          <TabPanel value={value} index={1}>
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
                      <TableCell sx={headerStyles}>Gross</TableCell>
                      <TableCell sx={headerStyles}>HDCP</TableCell>
                      <TableCell sx={headerStyles}>Net</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tournamentViewModel.leagueResults
                      .filter(
                        (result) =>
                          result.matchResults[0].idPlayer === userStats ||
                          result.matchResults[1].idPlayer === userStats
                      )
                      .sort((a, b) => differenceDate(a.date, b.date))
                      .map((match) => (
                        <TableRow
                          key={
                            match.matchResults[0].idPlayer +
                            "-" +
                            match.matchResults[1].idPlayer
                          }
                        >
                          <TableCell
                            sx={{ textAlign: "center", minWidth: "80px" }}
                          >
                            <TextField
                              size="small"
                              type="hidden"
                              name="id"
                              sx={{ display: "none" }}
                              defaultValue={
                                match.matchResults[0].idPlayer +
                                "-" +
                                match.matchResults[1].idPlayer
                              }
                            />{" "}
                            {convertMomentDate(match.date)}{" "}
                          </TableCell>
                          <TableCell
                            sx={{ textAlign: "center", minWidth: "80px" }}
                          >
                            {match.matchResults[0].playerName} <br />{" "}
                            {match.matchResults[1].playerName}
                          </TableCell>
                          {!hideMatch && (
                            <TableCell
                              sx={{ textAlign: "center", minWidth: "80px" }}
                            >
                              <TextField
                                size="small"
                                type="text"
                                name="matchpoints1"
                                defaultValue={match.matchResults[0].matchPoints}
                                onChange={() =>
                                  handleUpdateRow(
                                    match.matchResults[0].idPlayer +
                                      "-" +
                                      match.matchResults[1].idPlayer
                                  )
                                }
                              />{" "}
                              <br />{" "}
                              <TextField
                                size="small"
                                type="text"
                                name="matchpoints2"
                                defaultValue={match.matchResults[1].matchPoints}
                                onChange={() =>
                                  handleUpdateRow(
                                    match.matchResults[0].idPlayer +
                                      "-" +
                                      match.matchResults[1].idPlayer
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
                                defaultValue={match.matchResults[0].medalPoints}
                                onChange={() =>
                                  handleUpdateRow(
                                    match.matchResults[0].idPlayer +
                                      "-" +
                                      match.matchResults[1].idPlayer
                                  )
                                }
                              />{" "}
                              <br />{" "}
                              <TextField
                                size="small"
                                type="text"
                                name="medalPoints2"
                                defaultValue={match.matchResults[1].medalPoints}
                                onChange={() =>
                                  handleUpdateRow(
                                    match.matchResults[0].idPlayer +
                                      "-" +
                                      match.matchResults[1].idPlayer
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
                                defaultValue={match.matchResults[0].teamPoints}
                                onChange={() =>
                                  handleUpdateRow(
                                    match.matchResults[0].idPlayer +
                                      "-" +
                                      match.matchResults[1].idPlayer
                                  )
                                }
                              />{" "}
                              <br />{" "}
                              <TextField
                                size="small"
                                type="text"
                                name="teampoints2"
                                defaultValue={match.matchResults[1].teamPoints}
                                onChange={() =>
                                  handleUpdateRow(
                                    match.matchResults[0].idPlayer +
                                      "-" +
                                      match.matchResults[1].idPlayer
                                  )
                                }
                              />{" "}
                            </TableCell>
                          )}
                          <TableCell
                            sx={{ textAlign: "center", minWidth: "80px" }}
                          >
                            <p style={{ margin: 0 }}>
                              {match.matchResults[0].gross}
                            </p>
                            <br />{" "}
                            <p style={{ margin: 0 }}>
                              {match.matchResults[1].gross}
                            </p>
                          </TableCell>
                          <TableCell
                            sx={{ textAlign: "center", minWidth: "80px" }}
                          >
                            <p style={{ margin: 0 }}>
                              {match.matchResults[0].hcp}
                            </p>
                            <br />{" "}
                            <p style={{ margin: 0 }}>
                              {match.matchResults[1].hcp}
                            </p>
                          </TableCell>
                          <TableCell
                            sx={{ textAlign: "center", minWidth: "80px" }}
                          >
                            <p style={{ margin: 0 }}>
                              {match.matchResults[0].score}
                            </p>
                            <br />{" "}
                            <p style={{ margin: 0 }}>
                              {match.matchResults[1].score}
                            </p>
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
            {/* <TableContainer component={Box}>
              <Table sx={{ tableLayout: "fixed" }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={headerStyles}>Name</TableCell>
                    <TableCell sx={headerStyles}>Edit Matches</TableCell>
                    <TableCell sx={headerStyles}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ textAlign: "center" }}>
                      Adrian Aburto
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <nav aria-label="secondary mailbox folders">
                        <List>
                          <ListItem disablePadding>
                            <ListItemButton>
                              <ListItemText
                                primary="Daniela Cuenca"
                                secondary="12/11/2023"
                              />
                            </ListItemButton>
                          </ListItem>
                          <ListItem disablePadding>
                            <ListItemButton>
                              <ListItemText
                                primary="Matias Aburto"
                                secondary="12/11/2023"
                              />
                            </ListItemButton>
                          </ListItem>
                        </List>
                      </nav>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={handleOpen}
                      >
                        Remove from League
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ textAlign: "center" }}>
                      Matias Aburto
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <nav aria-label="secondary mailbox folders">
                        <List>
                          <ListItem disablePadding>
                            <ListItemButton>
                              <ListItemText
                                primary="Adrian Aburto"
                                secondary="12/11/2023"
                              />
                            </ListItemButton>
                          </ListItem>
                        </List>
                      </nav>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={handleOpen}
                      >
                        Remove from League
                      </Button>{" "}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ textAlign: "center" }}>
                      Daniela Cuenca
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <nav aria-label="secondary mailbox folders">
                        <List>
                          <ListItem disablePadding>
                            <ListItemButton>
                              <ListItemText
                                primary="Adrian Aburto"
                                secondary="12/11/2023"
                              />
                            </ListItemButton>
                          </ListItem>
                        </List>
                      </nav>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={handleOpen}
                      >
                        Remove from League
                      </Button>{" "}
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ background: "rgba(0, 0, 0, 0.06)" }}>
                    <TableCell sx={{ textAlign: "center" }}>
                      Player Inactive
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <nav aria-label="secondary mailbox folders">
                        <List>
                          <ListItem disablePadding>
                            <ListItemText
                              primary="Adrian Aburto"
                              secondary="12/11/2023"
                            />
                          </ListItem>
                        </List>
                      </nav>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      Inactive for moving to another country
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer> */}
          </TabPanel>
          <TabPanel value={value} index={2}>
            <p>Playoff Picture </p>
          </TabPanel>
          <TabPanel value={value} index={3}>
            <p>Click below if {currentTournament?.name} has concluded </p>
            <p>
              All scores and stats will be saved and set as view-only in
              participant’s League History
            </p>
            <Button
              variant="contained"
              type="button"
              onClick={() => sendEmail()}
            >
              Finish League
            </Button>
          </TabPanel>
          <TabPanel value={value} index={4}>
            <p>
              Click below to delete {currentTournament?.name} along with setup,
              scores and stats generated in this league
            </p>
            <Button
              variant="contained"
              type="button"
              onClick={() => tournamentViewModel.deleteLeague()}
            >
              Delete League
            </Button>
          </TabPanel>
        </React.Fragment>
      </Box>
    </div>
  );
};
export default observer(AdminLeague);

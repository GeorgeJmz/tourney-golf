import * as React from "react";
import { observer } from "mobx-react";
import UserViewModel from "../../viewModels/UserViewModel";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  IconButton,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getMessages } from "../../helpers/getMessages";
import { Messages } from "../../helpers/messages";
import {
  deleteActiveTourneyById,
  getAllTournaments,
  getUserByUID,
  getDaysSinceLastActivity,
} from "../../services/firebase";
import { ITournament } from "../../models/Tournament";

interface IAdminAllLeaguesProps {
  user: UserViewModel;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AdminAllLeagues: React.FC<IAdminAllLeaguesProps> = ({ user }) => {
  const [tournaments, setTournaments] = React.useState<ITournament[]>([]);
  const [filteredTournaments, setFilteredTournaments] = React.useState<
    ITournament[]
  >([]);
  const [loading, setLoading] = React.useState(true);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [openDetailsModal, setOpenDetailsModal] = React.useState(false);
  const [tournamentToDelete, setTournamentToDelete] =
    React.useState<ITournament | null>(null);
  const [selectedTournament, setSelectedTournament] =
    React.useState<ITournament | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [authorData, setAuthorData] = React.useState<{
    [key: string]: {
      name: string;
      email: string;
    };
  }>({});
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const allTournaments = await getAllTournaments();
        setTournaments(allTournaments);
        setFilteredTournaments(allTournaments);

        // Obtener datos completos de autores
        const authorIds = [
          ...new Set(allTournaments.map((t) => t.author)),
        ].filter(Boolean);
        const authorDataMap: {
          [key: string]: { name: string; email: string };
        } = {};

        await Promise.all(
          authorIds.map(async (authorId) => {
            try {
              const userData = await getUserByUID(authorId);
              if (userData) {
                authorDataMap[authorId] = {
                  name: `${userData.name} ${userData.lastName || ""}`.trim(),
                  email: userData.email || authorId,
                };
              } else {
                authorDataMap[authorId] = {
                  name: authorId,
                  email: "",
                };
              }
            } catch (error) {
              console.error(`Error fetching user ${authorId}:`, error);
              authorDataMap[authorId] = {
                name: authorId,
                email: "",
              };
            }
          })
        );

        setAuthorData(authorDataMap);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
        toast.error("Error loading tournaments");
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  React.useEffect(() => {
    let filtered = tournaments;

    if (searchTerm) {
      filtered = filtered.filter(
        (tournament) =>
          tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tournament.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (authorData[tournament.author] &&
            authorData[tournament.author].name
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (authorData[tournament.author] &&
            authorData[tournament.author].email
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (tournament) => tournament.status === statusFilter
      );
    }

    setFilteredTournaments(filtered);
  }, [tournaments, searchTerm, statusFilter, authorData]);

  const handleDeleteClick = (tournament: ITournament) => {
    setTournamentToDelete(tournament);
    setOpenDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!tournamentToDelete) {
      return;
    }

    const displayLoading = getMessages(Messages.LOADING);
    const cuToast = toast.loading(displayLoading);

    try {
      console.log("Tournament to delete:", tournamentToDelete.id);

      await deleteActiveTourneyById(tournamentToDelete.id || "");

      toast.dismiss(cuToast);
      toast.success("League deleted successfully");

      setTournaments((prev) =>
        prev.filter((t) => t.id !== tournamentToDelete.id)
      );
      setFilteredTournaments((prev) =>
        prev.filter((t) => t.id !== tournamentToDelete.id)
      );

      setOpenDeleteModal(false);
      setTournamentToDelete(null);
    } catch (error) {
      toast.dismiss(cuToast);
      toast.error("Error deleting league");
      console.error("Error deleting tournament:", error);
    }
  };

  const handleViewDetails = (tournament: ITournament) => {
    setSelectedTournament(tournament);
    setOpenDetailsModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "success";
      case "closed":
        return "error";
      case "incomplete":
        return "warning";
      default:
        return "default";
    }
  };

  const getTournamentTypeLabel = (type?: string) => {
    if (!type) {
      return "N/A";
    }

    const typeMap: { [key: string]: string } = {
      leagueteamplay: "League Team Play",
      teamplay: "Team Play",
      dogfight: "Dogfight",
      draft: "Draft",
    };

    return typeMap[type] || type;
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>Loading tournaments...</Typography>
      </Box>
    );
  }

  return (
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
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
        All Leagues Administration
      </Typography>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Search by name or author"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Status Filter</InputLabel>
            <Select
              value={statusFilter}
              label="Status Filter"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="published">Published</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredTournaments.length} of {tournaments.length}{" "}
          tournaments
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.main" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                League Name
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Type
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Status
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Players
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Author
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Created
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Last Activity
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTournaments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} sx={{ textAlign: "center" }}>
                  <Typography>
                    {tournaments.length === 0
                      ? "No tournaments found"
                      : "No tournaments match your filters"}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredTournaments.map((tournament) => (
                <TableRow key={tournament.id} hover>
                  <TableCell>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {tournament.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getTournamentTypeLabel(tournament.tournamentType)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={tournament.status  === "draft" ? "active" : tournament.status || "incomplete"}
                      color={getStatusColor(tournament.status || "incomplete")}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography>
                      {tournament.playersList?.length || 0} players
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {authorData[tournament.author]?.name || tournament.author}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {tournament.startDate
                        ? new Date(tournament.startDate).toLocaleDateString()
                        : "N/A"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const days = getDaysSinceLastActivity(tournament);
                      
                      if (days === null) {
                        return (
                          <Chip 
                            label="Sin datos" 
                            size="small" 
                            variant="outlined"
                          />
                        );
                      }
                      
                      let label = "";
                      let color: "success" | "default" | "warning" | "error" = "default";
                      
                      if (tournament.status === "closed") {
                        label = "Cerrada";
                        color = "error";
                      } else if (days === 0) {
                        label = "Hoy";
                        color = "success";
                      } else if (days === 1) {
                        label = "Hace 1 día";
                        color = "success";
                      } else if (days <= 7) {
                        label = `Hace ${days} días`;
                        color = "success";
                      } else if (days <= 30) {
                        label = `Hace ${days} días`;
                        color = "default";
                      } else {
                        label = `Hace ${days} días`;
                        color = "warning";
                      }
                      
                      return (
                        <Chip 
                          label={label}
                          color={color}
                          size="small"
                        />
                      );
                    })()}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton
                        color="primary"
                        onClick={() => handleViewDetails(tournament)}
                        title="View Details"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(tournament)}
                        title="Delete League"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={openDeleteModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpenDeleteModal(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Delete League</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <Typography variant="h6" textAlign="center" sx={{ mb: 2 }}>
              Are you sure you want to delete "{tournamentToDelete?.name}"?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This action cannot be undone. All league data, scores, and
              statistics will be permanently lost.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Box
            display="flex"
            gap="8px"
            justifyContent="space-between"
            width="100%"
          >
            <Button onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
            >
              Delete League
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Tournament Details Modal */}
      <Dialog
        open={openDetailsModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpenDetailsModal(false)}
        maxWidth="md"
        fullWidth
        aria-describedby="tournament-details-description"
      >
        <DialogTitle>
          <Typography variant="h5" component="div">
            {selectedTournament?.name}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              {/* Author Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Author Information
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Name
                    </Typography>
                    <Typography variant="body1">
                      {selectedTournament?.author &&
                      authorData[selectedTournament.author]
                        ? authorData[selectedTournament.author].name
                        : selectedTournament?.author || "N/A"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {selectedTournament?.author &&
                      authorData[selectedTournament.author]?.email
                        ? authorData[selectedTournament.author].email
                        : "N/A"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Basic Information */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Tournament Type
                    </Typography>
                    <Typography variant="body1">
                      {getTournamentTypeLabel(
                        selectedTournament?.tournamentType
                      )}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Play Type
                    </Typography>
                    <Typography variant="body1">
                      {selectedTournament?.playType || "N/A"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={selectedTournament?.status || "active"}
                      color={getStatusColor(
                        selectedTournament?.status || "active"
                      )}
                      size="small"
                    />
                  </Box>
                </Box>
              </Grid>

              {/* Dates and Players */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Dates & Players
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Start Date
                    </Typography>
                    <Typography variant="body1">
                      {selectedTournament?.startDate
                        ? new Date(
                            selectedTournament.startDate
                          ).toLocaleDateString()
                        : "N/A"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Cut Off Date
                    </Typography>
                    <Typography variant="body1">
                      {selectedTournament?.cutOffDate
                        ? new Date(
                            selectedTournament.cutOffDate
                          ).toLocaleDateString()
                        : "N/A"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Last Activity
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body1">
                        {selectedTournament?.lastActivityDate
                          ? new Date(
                              selectedTournament.lastActivityDate
                            ).toLocaleDateString()
                          : "N/A"}
                      </Typography>
                      {selectedTournament && (() => {
                        const days = getDaysSinceLastActivity(selectedTournament);
                        if (days !== null && days > 0) {
                          return (
                            <Chip
                              label={days === 1 ? "1 día" : `${days} días`}
                              size="small"
                              color={days > 30 ? "warning" : "default"}
                            />
                          );
                        }
                        return null;
                      })()}
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Number of Players
                    </Typography>
                    <Typography variant="body1">
                      {selectedTournament?.playersList?.length || 0} players
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Champion
                    </Typography>
                    <Typography variant="body1">
                      {selectedTournament?.champion || "Not determined"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Players List */}
              {selectedTournament?.playersList &&
                selectedTournament.playersList.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Players ({selectedTournament.playersList.length})
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Conference</TableCell>
                            <TableCell>Group</TableCell>
                            <TableCell>Team</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedTournament.playersList.map(
                            (player, index) => (
                              <TableRow key={index}>
                                <TableCell>{player.name}</TableCell>
                                <TableCell>{player.email}</TableCell>
                                <TableCell>
                                  {player.conference || "N/A"}
                                </TableCell>
                                <TableCell>{player.group || "N/A"}</TableCell>
                                <TableCell>{player.team || "N/A"}</TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                )}

              {/* Additional Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Additional Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Points per Win
                        </Typography>
                        <Typography variant="body1">
                          {selectedTournament?.pointsPerWin || "N/A"}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Points per Tie
                        </Typography>
                        <Typography variant="body1">
                          {selectedTournament?.pointsPerTie || "N/A"}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Number of Rounds
                        </Typography>
                        <Typography variant="body1">
                          {selectedTournament?.numberOfRounds || "N/A"}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Playoffs Enabled
                        </Typography>
                        <Typography variant="body1">
                          {selectedTournament?.playOffs ? "Yes" : "No"}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Groups
                        </Typography>
                        <Typography variant="body1">
                          {selectedTournament?.groups || "N/A"}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Teams
                        </Typography>
                        <Typography variant="body1">
                          {selectedTournament?.teams?.length || "N/A"}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailsModal(false)}>Close</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setOpenDetailsModal(false);
              if (selectedTournament?.id) {
                navigate(`/manage-tournament/${selectedTournament.id}`);
              }
            }}
          >
            Manage Tournament
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default observer(AdminAllLeagues);

import * as React from "react";
import { observer } from "mobx-react";
import UserViewModel from "../../viewModels/UserViewModel";
import TournamentViewModel from "../../viewModels/TournamentViewModel";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import { Box } from "@mui/material";
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
import { useQueryClient } from "@tanstack/react-query";
import { getTournamentById } from "../../services/firebase";
import { toast } from "react-toastify";
import { ITournament } from "../../models/Tournament";

interface IManageTournamentProps {
  user: UserViewModel;
  tournament?: ITournament; // Prop opcional del torneo ya cargado
}

const ManageTournament: React.FC<IManageTournamentProps> = ({ user, tournament }) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [loadedTournament, setLoadedTournament] =
    React.useState<ITournament | null>(null);
  const [unauthorized, setUnauthorized] = React.useState(false);
  const navigate = useNavigate();
  const userId = React.useMemo(() => user.getUserId(), []);
  const queryClient = useQueryClient(); // Accede al QueryClient
  const tournamentViewModel = React.useMemo(
    () => new TournamentViewModel(),
    []
  );
  const { id } = useParams();

  // Verificar si es admin
  const isAdmin = React.useMemo(
    () => user.user.isAdmin === true,
    [user.user.isAdmin]
  );

  // Cargar torneo con verificación de permisos
  React.useEffect(() => {
    const loadTournamentFromFirebase = async () => {
      if (!id) {
        return;
      }

      // Si recibe tournament como prop (viene de AdminLeague), usarlo directamente
      if (tournament) {
        console.log("✅ Usando tournament recibido como prop:", tournament.name);
        setLoadedTournament(tournament);
        setUnauthorized(false);
        return; // ✅ No cargar desde Firebase, evita duplicación
      }

      // Primero verifica si es autor (tiene el torneo en su lista)
      const localTournament = user.tournaments.find((t) => t.id === id);

      if (localTournament) {
        setLoadedTournament(localTournament);
        setUnauthorized(false);
        return;
      }

      // Si NO es autor, verifica si es admin
      if (!isAdmin) {
        setUnauthorized(true);
        return;
      }

      // Si es admin pero no es autor, carga desde Firebase
      setLoading(true);
      try {
        const tournamentData = await getTournamentById(id);
        if (tournamentData) {
          setLoadedTournament(tournamentData);
          setUnauthorized(false);
        } else {
          setUnauthorized(true);
        }
      } catch (error) {
        console.error("Error loading tournament:", error);
        toast.error("Error al cargar el torneo");
        setUnauthorized(true);
      } finally {
        setLoading(false);
      }
    };

    loadTournamentFromFirebase();
  }, [id, user.tournaments, isAdmin, tournament]);

  const currentTournament = React.useMemo(
    () => loadedTournament || user.tournaments.find((t) => t.id === id),
    [loadedTournament, user.tournaments, id]
  );

  console.log(currentTournament, "currentTournament");

  // Inicializar tournamentViewModel cuando currentTournament esté disponible
  React.useEffect(() => {
    if (currentTournament && id && tournamentViewModel.author === "") {
      console.log("⚙️ Inicializando tournamentViewModel con:", currentTournament.name);
      tournamentViewModel.setTournament(currentTournament);
      tournamentViewModel.setTournamentId(id);
      tournamentViewModel.setAuthor(userId);
    }
  }, [currentTournament, id, tournamentViewModel, userId]);
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handlePrev = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleStepClick = (step: number) => {
    setActiveStep(step);
  };
  const handleReset = () => {
    tournamentViewModel.startTournament();
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    setTimeout(() => navigate("/dashboard"), 1000);
  };

  const steps = [
    {
      label: "League Setup",
      component: (
        <TourneySetup
          tournamentViewModel={tournamentViewModel}
          handleNext={handleNext}
        />
      ),
    },
    {
      label: "Rules Setup",
      component: (
        <RulesSetup
          tournamentViewModel={tournamentViewModel}
          handleNext={handleNext}
          handlePrev={handlePrev}
        />
      ),
    },
    {
      label: "Player Setup",
      component: (
        <PlayerSetup
          isEdit={true}
          tournamentViewModel={tournamentViewModel}
          handleNext={handleNext}
          handlePrev={handlePrev}
        />
      ),
    },
    {
      label: "Division Setup",
      component: (
        <GroupsSetup
          tournamentViewModel={tournamentViewModel}
          handleNext={handleNext}
          handlePrev={handlePrev}
        />
      ),
    },
    {
      label: "Conference Setup",
      component: (
        <ConferenceSetup
          tournamentViewModel={tournamentViewModel}
          handleNext={handleNext}
          handlePrev={handlePrev}
        />
      ),
    },
    {
      label: "Teams Setup",
      component: (
        <TeamSetup
          tournamentViewModel={tournamentViewModel}
          handleNext={handleNext}
          handlePrev={handlePrev}
        />
      ),
    },
    {
      label: "Rules & Calendars",
      component: (
        <CalendarsSetup
          tournamentViewModel={tournamentViewModel}
          handleNext={handleNext}
          handlePrev={handlePrev}
        />
      ),
    },
  ];

  const getFilteredSteps = () => {
    const type = tournamentViewModel.tournament.tournamentType;
    if (type === "league") {
      return steps.filter((s) => s.label !== "Teams Setup");
    }
    if (type === "teamplay" || type === "3stage") {
      return steps.filter(
        (s) => s.label !== "Division Setup" && s.label !== "Conference Setup"
      );
    }
    if (type === "dogfight" || type === "derby") {
      return steps.filter(
        (s) =>
          s.label !== "Division Setup" &&
          s.label !== "Conference Setup" &&
          s.label !== "Teams Setup"
      );
    }
    return steps;
  };

  // Estados de carga y error
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 3,
          minHeight: "300px",
        }}
      >
        <Typography>Cargando torneo...</Typography>
      </Box>
    );
  }

  if (unauthorized) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h5" color="error" gutterBottom>
          Acceso No Autorizado
        </Typography>
        <Typography variant="body1" color="text.secondary">
          No tienes permisos para administrar este torneo.
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate("/dashboard")}
        >
          Volver al Dashboard
        </Button>
      </Box>
    );
  }

  if (!currentTournament && !loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h5" color="error" gutterBottom>
          Torneo No Encontrado
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate("/dashboard")}
        >
          Volver al Dashboard
        </Button>
      </Box>
    );
  }

  // No renderizar hasta que tournamentViewModel esté inicializado
  if (!tournamentViewModel.tournament.name || tournamentViewModel.author === "") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 3,
          minHeight: "300px",
        }}
      >
        <Typography>Inicializando torneo...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ background: "white", p: 3 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {getFilteredSteps().map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              onClick={() => handleStepClick(index)}
              StepIconProps={{ completed: true }}
            >
              {step.label}
            </StepLabel>
            <StepContent>{step.component}</StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === getFilteredSteps().length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps are completed</Typography>
          <Button
            onClick={handleReset}
            sx={{ mt: 1, mr: 1 }}
            data-testid="done-setup"
          >
            Done
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default observer(ManageTournament);

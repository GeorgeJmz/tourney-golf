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

interface IManageTournamentProps {
  user: UserViewModel;
}

const ManageTournament: React.FC<IManageTournamentProps> = ({ user }) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const navigate = useNavigate();
  const userId = React.useMemo(() => user.getUserId(), []);
  const tournamentViewModel = React.useMemo(
    () => new TournamentViewModel(),
    []
  );
  const { id } = useParams();
  const currentTournament = React.useMemo(
    () => user.tournaments.find((t) => t.id === id),
    []
  );

  if (currentTournament && id && tournamentViewModel.author === "") {
    tournamentViewModel.setTournament(currentTournament);
    tournamentViewModel.setTournamentId(id);
    tournamentViewModel.setAuthor(userId);
  }
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
          tournamentViewModel={tournamentViewModel}
          handleNext={handleNext}
          handlePrev={handlePrev}
        />
      ),
    },
    {
      label: "Groups Setup",
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
        (s) => s.label !== "Groups Setup" && s.label !== "Conference Setup"
      );
    }
    return steps;
  };

  return (
    <Box sx={{ p: 3 }}>
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
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Done
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default observer(ManageTournament);

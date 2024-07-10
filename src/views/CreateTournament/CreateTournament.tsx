import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import TourneySetup from "./components/CreateTournament/TourneySetup";
import PlayerSetup from "./components/CreateTournament/PlayerSetup";
import GroupsSetup from "./components/CreateTournament/GroupsSetup";
import TeamSetup from "./components/CreateTournament/TeamSetup";
import ConferenceSetup from "./components/CreateTournament/ConferenceSetup";
import RulesSetup from "./components/CreateTournament/RulesSetup";
import TournamentViewModel from "../../viewModels/TournamentViewModel";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { observer } from "mobx-react";

import UserViewModel from "../../viewModels/UserViewModel";
import CalendarsSetup from "./components/CreateTournament/CalendarsSetup";
import { useNavigate } from "react-router-dom";
import { toJS } from "mobx";

interface ICreateTournamentProps {
  user: UserViewModel;
}

const CreateTournament: React.FC<ICreateTournamentProps> = ({ user }) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const navigate = useNavigate();
  const userId = React.useMemo(() => user.getUserId(), []);
  const tournamentViewModel = React.useMemo(
    () => new TournamentViewModel(),
    []
  );
  if (tournamentViewModel.getAuthor() === "") {
    tournamentViewModel.setAuthor(userId);
  }
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handlePrev = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleStepClick = (step: number) => {
    if (step < activeStep) {
      setActiveStep(step);
    }
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
    if (type === "dogfight") {
      return steps.filter(
        (s) =>
          s.label !== "Groups Setup" &&
          s.label !== "Conference Setup" &&
          s.label !== "Teams Setup"
      );
    }
    return steps;
  };

  return (
    <Box sx={{ background: "white", p: 3 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {getFilteredSteps().map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              onClick={() => handleStepClick(index)}
              StepIconProps={{ completed: index < activeStep }}
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

export default observer(CreateTournament);

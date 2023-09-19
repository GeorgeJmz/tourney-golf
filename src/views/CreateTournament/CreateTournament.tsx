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
import { observer } from "mobx-react";

import UserViewModel from "../../viewModels/UserViewModel";
import CalendarsSetup from "./components/CreateTournament/CalendarsSetup";

interface ICreateTournamentProps {
  user: UserViewModel;
}

const CreateTournament: React.FC<ICreateTournamentProps> = ({ user }) => {
  const [activeStep, setActiveStep] = React.useState(0);
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
    setActiveStep(0);
  };
  const steps = [
    {
      label: "Tourney Setup",
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

  return (
    <Box sx={{ background: "white", p: 3 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
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
      {/* {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )} */}
    </Box>
  );
};

export default observer(CreateTournament);

import React from "react";
import { observer } from "mobx-react";
import TournamentViewModel from "../../../../viewModels/TournamentViewModel";
import { Button } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";

interface PlayoffsSetupFormProps {
  tournamentViewModel: TournamentViewModel;
  handleNext: () => void;
  handlePrev: () => void;
}

const PlayoffsSetup: React.FC<PlayoffsSetupFormProps> = ({
  tournamentViewModel,
  handleNext,
  handlePrev,
}) => {
  return (
    <div>
      <Grid container>
        <Grid item xs={12}>
          PlayoffsSetup
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <Button
              type="button"
              variant="outlined"
              size="large"
              onClick={handlePrev}
            >
              Previous Step
            </Button>
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth>
            <Button
              type="button"
              variant="outlined"
              size="large"
              onClick={handleNext}
            >
              Next Step
            </Button>
          </FormControl>
        </Grid>
      </Grid>
    </div>
  );
};

export default observer(PlayoffsSetup);

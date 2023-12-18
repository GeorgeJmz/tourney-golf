import React from "react";
import { observer } from "mobx-react";
import TournamentViewModel from "../../../../viewModels/TournamentViewModel";
import { Button } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import { UploadButton } from "../../../../components/UploadButton";

interface CalendarSetupProps {
  tournamentViewModel: TournamentViewModel;
  handleNext: () => void;
  handlePrev: () => void;
}

const CalendarSetup: React.FC<CalendarSetupProps> = ({
  tournamentViewModel,
  handleNext,
  handlePrev,
}) => {
  return (
    <div>
      <Grid container>
        <Grid item xs={4}>
          <UploadButton
            buttonText="Upload Rules"
            pathName={`${tournamentViewModel.idTournament}/`}
            fileName="rules"
          />
        </Grid>
        <Grid item xs={4}>
          <UploadButton
            buttonText="Upload Calendar"
            pathName={`${tournamentViewModel.idTournament}/`}
            fileName="calendar"
          />
        </Grid>
        <Grid item xs={4}>
          <UploadButton
            buttonText="Calcutta PDF"
            pathName={`${tournamentViewModel.idTournament}/`}
            fileName="calcutta"
          />
        </Grid>
        <Grid item xs={12} sx={{ marginTop: "20px" }}>
          <FormControl>
            <Button
              type="button"
              variant="contained"
              size="large"
              onClick={handleNext}
            >
              {"Save and finish League setup"}
            </Button>
          </FormControl>
        </Grid>
      </Grid>
    </div>
  );
};

export default observer(CalendarSetup);

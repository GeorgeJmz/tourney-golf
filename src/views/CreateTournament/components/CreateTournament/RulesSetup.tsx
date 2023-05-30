import React from "react";
import { observer } from "mobx-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import TournamentViewModel from "../../../../viewModels/TournamentViewModel";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import { Button } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";

interface RulesSetupFormProps {
  tournamentViewModel: TournamentViewModel;
  handleNext: () => void;
  handlePrev: () => void;
}

const RulesSetup: React.FC<RulesSetupFormProps> = ({
  tournamentViewModel,
  handleNext,
  handlePrev,
}) => {
  return (
    <div>
      <Grid container>
        <Grid item xs={12}>
          RulesSetup
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

export default observer(RulesSetup);

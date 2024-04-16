import React from "react";
import { observer } from "mobx-react";
import {
  step2,
  step2FieldsValidations,
} from "../../../../helpers/getTournamentFields";
import { Button } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import TournamentViewModel from "../../../../viewModels/TournamentViewModel";
import { SendInvitations } from "../../../../components/SendInvitations";

interface PlayerSetupFormProps {
  tournamentViewModel: TournamentViewModel;
  handleNext: () => void;
  handlePrev: () => void;
}

const PlayerSetup: React.FC<PlayerSetupFormProps> = ({
  tournamentViewModel,
  handleNext,
}) => {
  const validationSchema = step2FieldsValidations;
  const emailList = tournamentViewModel.tournament.playersList;
  const onSubmitHandler = (email: string, name: string) => {
    tournamentViewModel.addEmailToList(email, name);
  };

  const onEditHandler = (email: string, name: string, index: number) => {
    tournamentViewModel.editEmailList(email, name, index);
  };

  const onRemoveHandler = (key: number) => {
    tournamentViewModel.removeEmailFromList(key);
  };

  const onNextHandler = () => {
    if (tournamentViewModel.tournament.playersList.length > 0) {
      tournamentViewModel.updateTournament({
        playersList: tournamentViewModel.tournament.playersList,
      });
    }
    handleNext();
  };

  return (
    <React.Fragment>
      <SendInvitations
        fields={step2}
        emailList={emailList}
        validationSchema={validationSchema}
        onSubmit={onSubmitHandler}
        onEdit={onEditHandler}
        onDelete={onRemoveHandler}
      />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl>
            <Button
              type="button"
              variant="contained"
              size="large"
              onClick={onNextHandler}
            >
              {"Save and next step"}
            </Button>
          </FormControl>
        </Grid>
        {/* <Grid item xs={6}>
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
              onClick={onNextHandler}
              disabled={playersLeft !== 0}
            >
              Next Step
            </Button>
          </FormControl>
        </Grid>*/}
      </Grid>
    </React.Fragment>
  );
};

export default observer(PlayerSetup);

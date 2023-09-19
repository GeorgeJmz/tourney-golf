import React from "react";
import { observer } from "mobx-react";

import TournamentViewModel from "../../../../viewModels/TournamentViewModel";
import { Button } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import {
  DragDrop,
  DragDropType,
  IGroupDraggable,
} from "../../../../components/DragDrop";
import type { IPlayer } from "../../../../models/Tournament";

interface TeamSetupProps {
  tournamentViewModel: TournamentViewModel;
  handleNext: () => void;
  handlePrev: () => void;
}

const TeamSetup: React.FC<TeamSetupProps> = ({
  tournamentViewModel,
  handleNext,
  handlePrev,
}) => {
  const [teams, setTeams] = React.useState<Array<IGroupDraggable>>([]);

  const onNextHandler = () => {
    if (teams.length > 0) {
      tournamentViewModel.updateTeams(teams);
    }
    handleNext();
  };

  const players = tournamentViewModel.emailList.map(({ email, name }, key) => ({
    id: `${email}-${key}`,
    email: email,
    name: name,
    handicap: 10,
  })) as Array<IPlayer>;

  const isNextDisabled =
    tournamentViewModel.tournament.teams.length === 0 && teams.length === 0;

  return (
    <div>
      <DragDrop
        typeOfDraggable={DragDropType.Teams}
        listOfDraggable={players}
        onUpdateGroups={(teams) => setTeams(teams)}
        initialGroups={tournamentViewModel.tournament.teams}
      />

      <Grid container>
        <Grid item xs={12} sx={{ marginTop: "20px" }}>
          <FormControl>
            <Button
              type="button"
              variant="contained"
              size="large"
              onClick={onNextHandler}
              disabled={isNextDisabled}
            >
              {"Save and next step"}
            </Button>
          </FormControl>
        </Grid>
      </Grid>
    </div>
  );
};

export default observer(TeamSetup);

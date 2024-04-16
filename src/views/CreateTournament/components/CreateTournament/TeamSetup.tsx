import React from "react";
import { observer } from "mobx-react";

import TournamentViewModel from "../../../../viewModels/TournamentViewModel";
import { Button } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import { DragDropv2, DragDropType } from "../../../../components/DragDropv2";
import type { ITournamentGroup } from "../../../../models/Tournament";
import { toJS } from "mobx";

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
  const onNextHandler = () => {
    tournamentViewModel.saveEmailList();
    handleNext();
  };

  const onUpdateGroups = (teams: Array<ITournamentGroup>) => {
    tournamentViewModel.updateTeamList(teams);
  };
  const onUpdateGroupPlayers = (group: string, idPlayer: string) => {
    tournamentViewModel.updateTeamPlayers(group, idPlayer);
  };

  const isNextDisabled =
    tournamentViewModel.tournament.playersList.filter(
      (player) => player.team === "" || player.team === "0initial"
    ).length > 0;

  return (
    <div>
      <DragDropv2
        numberOfOptions={20}
        typeOfDraggable={DragDropType.Teams}
        listOfDraggable={tournamentViewModel.tournament.playersList}
        listOfGroups={tournamentViewModel.tournament.teamsList}
        onUpdateGroups={(teams) => onUpdateGroups(teams)}
        onUpdateGroupPlayers={(group, idPlayer) =>
          onUpdateGroupPlayers(group, idPlayer)
        }
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

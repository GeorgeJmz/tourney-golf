import React from "react";
import { observer } from "mobx-react";
import TournamentViewModel from "../../../../viewModels/TournamentViewModel";
import { Button } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import { DragDropv2, DragDropType } from "../../../../components/DragDropv2";
import type { ITournamentGroup } from "../../../../models/Tournament";
import { toJS } from "mobx";
interface GroupsSetupFormProps {
  tournamentViewModel: TournamentViewModel;
  handleNext: () => void;
  handlePrev: () => void;
}

const GroupsSetup: React.FC<GroupsSetupFormProps> = ({
  tournamentViewModel,
  handleNext,
  handlePrev,
}) => {
  const onNextHandler = () => {
    tournamentViewModel.saveEmailList();
    handleNext();
  };

  const onUpdateGroups = (groups: Array<ITournamentGroup>) => {
    tournamentViewModel.updateGroupList(groups);
  };
  const onUpdateGroupPlayers = (group: string, idPlayer: string) => {
    tournamentViewModel.updateGroupPlayers(group, idPlayer);
  };

  console.log(toJS(tournamentViewModel.tournament.playersList), "playersList");

  const isNextDisabled =
    tournamentViewModel.tournament.playersList.filter(
      (player) => player.group === "" || player.group === "0initial"
    ).length > 0;

  return (
    <div>
      <DragDropv2
        numberOfOptions={8}
        typeOfDraggable={DragDropType.Groups}
        listOfDraggable={tournamentViewModel.tournament.playersList}
        listOfGroups={tournamentViewModel.tournament.groupsList}
        onUpdateGroups={(groups) => onUpdateGroups(groups)}
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
              disabled={isNextDisabled}
              onClick={onNextHandler}
            >
              {"Save and next step"}
            </Button>
          </FormControl>
        </Grid>
      </Grid>
    </div>
  );
};

export default observer(GroupsSetup);

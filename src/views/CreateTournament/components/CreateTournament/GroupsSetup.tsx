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
  const [groups, setGroups] = React.useState<Array<IGroupDraggable>>([]);

  const onNextHandler = () => {
    if (groups.length > 0) {
      tournamentViewModel.updatePlayersPerGroup(groups);
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
    tournamentViewModel.tournament.playersPerGroup.length === 0 &&
    groups.length === 0;

  return (
    <div>
      <DragDrop
        typeOfDraggable={DragDropType.Groups}
        listOfDraggable={players}
        onUpdateGroups={(groups) => setGroups(groups)}
        initialGroups={tournamentViewModel.tournament.playersPerGroup}
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

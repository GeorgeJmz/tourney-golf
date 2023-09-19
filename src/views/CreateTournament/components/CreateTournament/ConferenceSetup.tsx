import React from "react";
import { observer } from "mobx-react";
import TournamentViewModel from "../../../../viewModels/TournamentViewModel";
import { Button } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import {
  DragDrop,
  IGroupDraggable,
  DragDropType,
} from "../../../../components/DragDrop";
import type { IPlayer } from "../../../../models/Tournament";

interface ConferenceSetupProps {
  tournamentViewModel: TournamentViewModel;
  handleNext: () => void;
  handlePrev: () => void;
}

const ConferenceSetup: React.FC<ConferenceSetupProps> = ({
  tournamentViewModel,
  handleNext,
  handlePrev,
}) => {
  const [conferences, setConferences] = React.useState<Array<IGroupDraggable>>(
    []
  );

  const onNextHandler = () => {
    tournamentViewModel.updateConference(conferences);
    handleNext();
  };

  const conference = tournamentViewModel.tournament.playersPerGroup.map(
    ({ id, name }, key) => ({
      id: `${id}-${key}`,
      email: name,
      name: name,
      handicap: 10,
    })
  ) as Array<IPlayer>;

  const isNextDisabled =
    tournamentViewModel.tournament.conference.length === 0 &&
    conferences.length === 0;

  return (
    <div>
      <DragDrop
        typeOfDraggable={DragDropType.Conferences}
        listOfDraggable={conference.filter(
          (player) => player.id !== "group0-0"
        )}
        onUpdateGroups={(conference) => setConferences(conference)}
        initialGroups={tournamentViewModel.tournament.conference}
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

export default observer(ConferenceSetup);

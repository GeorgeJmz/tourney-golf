import React from "react";
import { observer } from "mobx-react";
import TournamentViewModel from "../../../../viewModels/TournamentViewModel";
import { Button } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import { DragDropv2, DragDropType } from "../../../../components/DragDropv2";
import { toJS } from "mobx";
import type { ITournamentGroup } from "../../../../models/Tournament";

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
  const onNextHandler = () => {
    tournamentViewModel.saveEmailList();
    handleNext();
  };

  const onUpdateGroups = (conferences: Array<ITournamentGroup>) => {
    tournamentViewModel.updateConferencesList(conferences);
  };
  const onUpdateGroupPlayers = (conference: string, groupId: string) => {
    tournamentViewModel.updateConferenceGroup(conference, groupId);
  };

  const isNextDisabled =
    tournamentViewModel.tournament.groupsList.filter(
      (group) => group.conference === "" || group.conference === "0initial"
    ).length > 0;

  return (
    <div>
      {/* <DragDrop
        numberOfOptions={6}
        typeOfDraggable={DragDropType.Conferences}
        listOfDraggable={conference.filter(
          (player) => player.id !== "group0-0"
        )}
        onUpdateGroups={(conference) => setConferences(conference)}
        initialGroups={tournamentViewModel.tournament.conference}
      /> */}

      <DragDropv2
        numberOfOptions={8}
        typeOfDraggable={DragDropType.Conferences}
        listOfDraggable={tournamentViewModel.tournament.groupsList}
        groupsDraggable={tournamentViewModel.tournament.groupsList}
        listOfGroups={tournamentViewModel.tournament.conferencesList}
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

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
  const [editedColumnTitle, setEditedColumnTitle] = React.useState<string>("");

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const { source, destination } = result;
    const groupSourceIndex = parseInt(source.droppableId.replace("group", ""));
    const groupDestinationIndex = parseInt(
      destination.droppableId.replace("group", "")
    );
    tournamentViewModel.movePlayer(
      groupSourceIndex,
      source.index,
      groupDestinationIndex
    );
  };

  const handleColumnTitleEdit = (columnId: string) => {
    tournamentViewModel.tournament.playersPerGroup.forEach((col) => {
      if (col.id === columnId) {
        col.isEditing = !col.isEditing;
      } else {
        col.isEditing = false;
      }
    });
  };

  const handleColumnTitleUpdate = (columnId: string) => {
    tournamentViewModel.tournament.playersPerGroup.forEach((col) => {
      if (col.id === columnId) {
        col.name = editedColumnTitle;
        col.isEditing = false;
      }
    });
  };

  const onNextHandler = () => {
    tournamentViewModel.updatePlayersPerGroup();
    handleNext();
  };

  return (
    <div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Grid container spacing={2}>
          {tournamentViewModel.tournament.playersPerGroup.map((group) => (
            <Grid item key={group.id} xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="h2">
                    {group.isEditing ? (
                      <FormControl fullWidth>
                        <TextField
                          value={editedColumnTitle}
                          onChange={(e) => setEditedColumnTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleColumnTitleUpdate(group.id);
                            }
                          }}
                          autoFocus
                        />
                      </FormControl>
                    ) : (
                      group.name
                    )}
                    <IconButton
                      onClick={() => {
                        if (!group.isEditing) {
                          setEditedColumnTitle(group.name);
                          handleColumnTitleEdit(group.id);
                        } else {
                          handleColumnTitleUpdate(group.id);
                        }
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Typography>
                  <Droppable droppableId={group.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        style={{
                          backgroundColor: snapshot.isDraggingOver
                            ? "lightblue"
                            : "inherit",
                          padding: 4,
                          minHeight: 200,
                        }}
                      >
                        {group.players.map((player, playerIndex) => (
                          <Draggable
                            key={player.id}
                            draggableId={player.id}
                            index={playerIndex}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <Card
                                  style={{
                                    marginTop: 4,
                                    backgroundColor: "white",
                                  }}
                                >
                                  <CardContent>
                                    <Typography variant="body2" component="p">
                                      {player.name}
                                    </Typography>
                                    <Typography variant="body2" component="p">
                                      {player.email}
                                    </Typography>
                                  </CardContent>
                                </Card>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DragDropContext>

      <Grid container>
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
              onClick={onNextHandler}
            >
              Next Step
            </Button>
          </FormControl>
        </Grid>
      </Grid>
    </div>
  );
};

export default observer(GroupsSetup);

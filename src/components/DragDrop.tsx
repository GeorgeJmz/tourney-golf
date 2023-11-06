import React, { useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { toJS } from "mobx";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { SelectInput } from "./SelectInput";
import Grid from "@mui/material/Grid";
import { ITournamentElement } from "../helpers/getTournamentFields";
import type { IPlayer } from "../models/Tournament";
import { GroupTitle } from "./GroupTitle";

export enum DragDropType {
  Groups = "Groups",
  Conferences = "Conferences",
  Teams = "Teams",
}

interface DragDropProps {
  numberOfOptions: number;
  typeOfDraggable: DragDropType;
  listOfDraggable: Array<IPlayer>;
  onUpdateGroups: (groups: Array<IGroupDraggable>) => void;
  initialGroups?: Array<IGroupDraggable>;
}

export interface IConferenceDraggable {
  id: string;
  name: string;
}

export interface IGroupDraggable {
  id: string;
  name: string;
  isEditing: boolean;
  players: Array<IPlayer>;
  conferences?: Array<IConferenceDraggable>;
}

export const DragDrop: React.FC<DragDropProps> = ({
  listOfDraggable,
  onUpdateGroups,
  initialGroups,
  typeOfDraggable,
  numberOfOptions,
}) => {
  const initialGroupsState = toJS(initialGroups);
  const isFirstRender = initialGroupsState?.length.toString();
  const [numberOfGroups, setNumberOfGroups] = React.useState<string>(
    initialGroupsState?.length.toString() || "2"
  );
  const [showElements, setShowElements] = React.useState<boolean>(
    initialGroups ? initialGroups.length > 0 : false
  );
  const [groupsWithElements, setGroupsWithElements] = React.useState<
    Array<IGroupDraggable>
  >(initialGroupsState || []);

  const textByType = (type: DragDropType) => {
    const mapTypes = {
      [DragDropType.Conferences]: {
        name: "Conferences",
        placeholder: "Number of Conferences",
        destination: "conference0",
        replace: "conference",
      },
      [DragDropType.Groups]: {
        name: "Groups",
        placeholder: "Number of Groups",
        destination: "group0",
        replace: "group",
      },
      [DragDropType.Teams]: {
        name: "Teams",
        placeholder: "Number of Teams",
        destination: "team0",
        replace: "team",
      },
    };
    return mapTypes[type];
  };

  const texts = textByType(typeOfDraggable);

  useEffect(() => {
    if (
      listOfDraggable.length > 0 &&
      numberOfGroups !== "" &&
      isFirstRender === "0"
    ) {
      const newGroups = Array.from(
        Array(parseInt(numberOfGroups) + 1).keys()
      ).map((i) => ({
        id: `${texts.replace}${i}`,
        name: `${texts.replace} ${i}`,
        isEditing: false,
        players: [] as Array<IPlayer>,
      }));

      newGroups[0].players = listOfDraggable;
      setGroupsWithElements(newGroups);
    }
  }, [numberOfGroups]);

  const inputElement: ITournamentElement = {
    name: texts.name,
    placeholder: texts.placeholder,
    input: "select",
    size: {
      xs: 12,
      md: 4,
      lg: 4,
    },
    options: Array(numberOfOptions)
      .fill(0)
      .map((_, i) => ({
        displayName: `${i + 1}`,
        value: `${i + 1}`,
      })),
  };

  const movePlayer = (
    indexGroup: number,
    indexPlayer: number,
    destinationGroup: number
  ) => {
    const newGroups = [...groupsWithElements];

    newGroups[destinationGroup].players.push(
      newGroups[indexGroup].players[indexPlayer]
    );
    delete newGroups[indexGroup].players[indexPlayer];
    newGroups[destinationGroup].players = newGroups[
      destinationGroup
    ].players.filter((a) => a);
    newGroups[indexGroup].players = newGroups[indexGroup].players.filter(
      (a) => a
    );
    onUpdateGroups(newGroups);
    setGroupsWithElements(newGroups);
  };

  const onDragEnd = (result: DropResult) => {
    if (
      !result.destination ||
      result.destination.droppableId === texts.destination
    ) {
      return;
    }
    const { source, destination } = result;
    const groupSourceIndex = parseInt(
      source.droppableId.replace(texts.replace, "")
    );
    const groupDestinationIndex = parseInt(
      destination.droppableId.replace(texts.replace, "")
    );
    movePlayer(groupSourceIndex, source.index, groupDestinationIndex);
  };

  const onUpdateTitleGroupHandler = (group: IGroupDraggable) => {
    const newGroups = [...groupsWithElements];
    newGroups.forEach((a) => {
      if (a.id === group.id) {
        a.name = group.name;
      }
    });
    onUpdateGroups(newGroups);
    setGroupsWithElements(newGroups);
  };

  return (
    <div>
      {!showElements && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={2} md={2}></Grid>
          <SelectInput
            inputElement={inputElement}
            isError={false}
            onChangeHandler={(e) => {
              const value = e.target.value;
              setNumberOfGroups(value);
            }}
            value={numberOfGroups}
            error={""}
            key={0}
          />
          <Grid item xs={12} sm={2} md={2} sx={{ marginTop: "20px" }}>
            <IconButton
              aria-label="delete"
              size="large"
              color="primary"
              onClick={() => {
                setShowElements(true);
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
            {/* <Button
              type="button"
              variant="outlined"
              size="large"
              disabled={numberOfGroups === ""}
              onClick={() => {
                setShowElements(true);
              }}
            >
              Continue
            </Button> */}
          </Grid>
        </Grid>
      )}
      {showElements && (
        <Grid container spacing={2}>
          <DragDropContext onDragEnd={onDragEnd}>
            {groupsWithElements.map((a, index) => (
              <Grid
                item
                key={a.id}
                xs={12}
                sm={index === 0 ? 12 : 6}
                md={index === 0 ? 12 : 4}
              >
                <Card>
                  <CardContent>
                    {/* {index !== 0 && (
                      <GroupTitle
                        group={a}
                        onUpdateTitleGroup={onUpdateTitleGroupHandler}
                      />
                    )} */}
                    <Droppable droppableId={a.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          style={{
                            backgroundColor: snapshot.isDraggingOver
                              ? "lightblue"
                              : "inherit",
                            padding: 4,
                            minHeight: 100,
                            display: "flex",
                            flexWrap: "wrap",
                            overflowY: "scroll",
                          }}
                        >
                          {a.players.map((player, playerIndex) => (
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
                                      maxWidth: 300,
                                    }}
                                  >
                                    <CardContent
                                      style={{
                                        paddingBottom: "16px",
                                      }}
                                    >
                                      <Typography variant="body2" component="p">
                                        {player.name}
                                      </Typography>
                                      {/* <Typography variant="body2" component="p">
                                        {player.email}
                                      </Typography> */}
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
          </DragDropContext>
        </Grid>
      )}
    </div>
  );
};

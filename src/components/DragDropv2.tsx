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
import type { IPlayer, ITournamentGroup } from "../models/Tournament";
import { GroupTitle } from "./GroupTitle";
import { json } from "stream/consumers";

export enum DragDropType {
  Groups = "Groups",
  Conferences = "Conferences",
  Teams = "Teams",
}

export interface DragDropv2Props {
  numberOfOptions: number;
  typeOfDraggable: DragDropType;
  listOfDraggable: Array<Partial<IPlayer>>;
  groupsDraggable?: Array<Partial<ITournamentGroup>>;
  listOfGroups: Array<ITournamentGroup>;
  onUpdateGroups: (groups: Array<ITournamentGroup>) => void;
  onUpdateGroupPlayers: (group: string, idPlayer: string) => void;
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

export const DragDropv2: React.FC<DragDropv2Props> = ({
  listOfDraggable,
  onUpdateGroups,
  groupsDraggable,
  listOfGroups,
  typeOfDraggable,
  numberOfOptions,
  onUpdateGroupPlayers,
}) => {
  const [numberOfGroups, setNumberOfGroups] = React.useState<string>(
    listOfGroups ? listOfGroups.length.toString() : "0"
  );
  const [showElements, setShowElements] = React.useState<boolean>(
    listOfGroups ? listOfGroups.length > 0 : false
  );

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
    if (listOfGroups.length === 0) {
      const newGroups = Array.from(Array(parseInt(numberOfGroups)).keys()).map(
        (i) => ({
          id: `${texts.replace}${i + 1}`,
          name: `${texts.replace} ${i + 1}`,
        })
      );

      onUpdateGroups(newGroups);
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

  const onDragEnd = (result: DropResult) => {
    console.log(result, "result");
    if (
      !result.destination ||
      result.destination.droppableId === texts.destination
    ) {
      return;
    }
    const { destination, draggableId } = result;
    onUpdateGroupPlayers(destination.droppableId, draggableId);
  };

  const onUpdateTitleGroupHandler = (group: ITournamentGroup) => {
    const newGroups = [...listOfGroups];
    newGroups.forEach((a) => {
      if (a.id === group.id) {
        a.name = group.name;
      }
    });
    onUpdateGroups(newGroups);
  };

  const getFilteredList = (id: string) => {
    if (
      typeOfDraggable === DragDropType.Teams ||
      typeOfDraggable === DragDropType.Groups
    ) {
      return listOfDraggable?.filter((player) => {
        const playerGroupOrTeam =
          texts.replace === "group" ? player.group : player.team;
        if (playerGroupOrTeam) {
          return playerGroupOrTeam === id;
        }
        return id === "0initial";
      });
    }
    if (typeOfDraggable === DragDropType.Conferences) {
      return groupsDraggable?.filter((group) => {
        if (group.conference) {
          return group.conference === id;
        }
        return id === "0initial";
      });
    }
  };

  const getDragabbleList = (id: string) => {
    const list = getFilteredList(id);
    return (
      <>
        {list?.map((player, playerIndex) => (
          <Draggable
            key={player.id}
            draggableId={player.id || ""}
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
                  </CardContent>
                </Card>
              </div>
            )}
          </Draggable>
        ))}
      </>
    );
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
          </Grid>
        </Grid>
      )}
      {showElements && (
        <Grid container spacing={2}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Grid item key={"0initial"} xs={12} sm={12} md={12}>
              <Card>
                <CardContent>
                  <Droppable droppableId={"0initial"}>
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
                        {getDragabbleList("0initial")}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </CardContent>
              </Card>
            </Grid>
            {listOfGroups.map((group) => (
              <Grid item key={group.id} xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <GroupTitle
                      group={group}
                      onUpdateTitleGroup={onUpdateTitleGroupHandler}
                    />
                    <Droppable droppableId={group.id}>
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
                          {getDragabbleList(group.id)}
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

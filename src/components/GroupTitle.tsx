import React from "react";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import FormControl from "@mui/material/FormControl";
import type { IGroupDraggable } from "./DragDrop";

interface IGroupTitleProps {
  group: IGroupDraggable;
  onUpdateTitleGroup: (group: IGroupDraggable) => void;
}

export const GroupTitle: React.FC<IGroupTitleProps> = ({
  group,
  onUpdateTitleGroup,
}) => {
  const [editedColumnTitle, setEditedColumnTitle] = React.useState<string>("");
  const [isEditing, setIsEditing] = React.useState<boolean>(false);

  const handleColumnTitleUpdate = () => {
    const newGroup = { ...group };
    newGroup.name = editedColumnTitle;
    setIsEditing(false);
    onUpdateTitleGroup(newGroup);
  };

  return (
    <Typography variant="h6" component="h2">
      {isEditing ? (
        <FormControl fullWidth>
          <TextField
            value={editedColumnTitle}
            onChange={(e) => setEditedColumnTitle(e.target.value)}
            onBlur={() => handleColumnTitleUpdate()}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleColumnTitleUpdate();
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
          if (!isEditing) {
            setIsEditing(true);
            setEditedColumnTitle(group.name);
          } else {
            handleColumnTitleUpdate();
          }
        }}
      >
        <EditIcon />
      </IconButton>
    </Typography>
  );
};

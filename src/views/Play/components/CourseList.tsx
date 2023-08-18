import * as React from "react";
import { observer } from "mobx-react";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import StarBorder from "@mui/icons-material/StarBorder";
import Star from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Collapse from "@mui/material/Collapse";
import type { IGolfCourse } from "../../../viewModels/PlayViewModel";
import type { GolfCourse } from "../../../services/courses";

interface ICourseList {
  courses: Array<IGolfCourse>;
  currentTeeBox: string;
  onOpenCourse: (id: string) => void;
  onSelectTeeBox: (course: GolfCourse, id: string) => void;
}

const CourseList: React.FC<ICourseList> = ({
  courses,
  currentTeeBox,
  onOpenCourse,
  onSelectTeeBox,
}) => {
  return (
    <List>
      {courses.map(({ course, isOpen }) => (
        <React.Fragment key={course.id}>
          <ListItemButton
            onClick={() => onOpenCourse(course.id)}
            key={course.id}
          >
            <ListItemIcon>
              <LocationOnIcon />
            </ListItemIcon>
            <ListItemText
              primary={`${course.name}`}
              secondary={
                <Typography
                  sx={{ display: "inline" }}
                  component="span"
                  variant="caption"
                  color="text.primary"
                >
                  {`${course.address} - ${course.distance}`}
                </Typography>
              }
            />
          </ListItemButton>
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {course.teeBoxes.map(({ color, length, id }) => (
                <ListItemButton
                  sx={{ pl: 4 }}
                  onClick={() => onSelectTeeBox(course, id)}
                  key={id}
                >
                  <ListItemIcon>
                    {currentTeeBox === id ? (
                      <Star color="secondary" />
                    ) : (
                      <StarBorder color="secondary" />
                    )}
                  </ListItemIcon>
                  <ListItemText primary={color} secondary={length} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </React.Fragment>
      ))}
    </List>
  );
};

export default observer(CourseList);

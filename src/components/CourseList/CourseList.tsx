import {
  Autocomplete,
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import React from "react";
import type { IGolfCourse } from "../../viewModels/PlayViewModel";
import type { GolfCourse } from "../../services/courses";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import Star from "@mui/icons-material/Star";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import DashboardTitle from "../DashboardTitle/DashboardTitle";

interface CourseListProps {
  lastCourse: Array<string>;
  courses: Array<IGolfCourse>;
  currentTeeBox: string;
  onOpenCourse: (id: string) => void;
  onSelectTeeBox: (course: GolfCourse, id: string) => void;
}
const CourseList: React.FC<CourseListProps> = ({
  lastCourse,
  courses,
  currentTeeBox,
  onOpenCourse,
  onSelectTeeBox,
}) => {
  const [selectedCourse, setSelectedCourse] =
    React.useState<IGolfCourse | null>(null);

  const [activeAccordion, setActiveAccordion] = React.useState<string>("");

  const [previousCourses, setPreviousCourses] = React.useState<
    Array<IGolfCourse>
  >([]);
  const [allCourses, setAllCourses] = React.useState<Array<IGolfCourse>>([]);

  React.useEffect(() => {
    const previous = courses.filter((course) =>
      lastCourse.includes(course.course.id)
    );
    const all = courses.filter(
      (course) => !lastCourse.includes(course.course.id)
    );
    setAllCourses(all);
    setPreviousCourses(previous);
  }, [lastCourse, courses]);
  return (
    <Box width="100%">
      <List>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={allCourses}
          value={selectedCourse as IGolfCourse | null}
          onChange={(event, value) => {
            setSelectedCourse(value as IGolfCourse | null);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Select Course" />
          )}
        />
        {selectedCourse && (
          <React.Fragment>
            <ListItemButton
              sx={{ color: "white", fontWeight: 500, fontSize: "20px" }}
              onClick={() =>
                setActiveAccordion((prev) =>
                  prev === selectedCourse?.course.id
                    ? ""
                    : selectedCourse?.course.id
                )
              }
              key={selectedCourse?.course.id}
            >
              <ListItemIcon>
                {activeAccordion === selectedCourse?.course.id ? (
                  <ExpandMoreIcon />
                ) : (
                  <KeyboardArrowRightIcon />
                )}
              </ListItemIcon>
              <ListItemText primary={`${selectedCourse?.course.name}`} />
            </ListItemButton>
            <Collapse
              in={activeAccordion === selectedCourse?.course.id}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                {selectedCourse?.course.teeBoxes.map(
                  ({ color, length, id }) => (
                    <ListItemButton
                      sx={{
                        pl: 4,
                        color: "white",
                        fontWeight: 500,
                        fontSize: "20px",
                      }}
                      onClick={() => onSelectTeeBox(selectedCourse?.course, id)}
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
                  )
                )}
              </List>
            </Collapse>
          </React.Fragment>
        )}
        <Box>
          {previousCourses.map((prevC) => (
            <Box key={prevC.course.id}>
              <ListItemButton
                sx={{ color: "white", fontWeight: 500, fontSize: "20px" }}
                onClick={() =>
                  setActiveAccordion((prev) =>
                    prev === prevC.course.id ? "" : prevC.course.id
                  )
                }
                key={prevC.course.id}
              >
                <ListItemIcon>
                  {activeAccordion === prevC.course.id ? (
                    <ExpandMoreIcon />
                  ) : (
                    <KeyboardArrowRightIcon />
                  )}
                </ListItemIcon>
                <ListItemText primary={`${prevC.course.name}`} />
              </ListItemButton>
              <Collapse
                in={activeAccordion === prevC.course.id}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {prevC.course.teeBoxes.map(({ color, length, id }) => (
                    <ListItemButton
                      sx={{
                        pl: 4,
                        color: "white",
                        fontWeight: 500,
                        fontSize: "20px",
                      }}
                      onClick={() => onSelectTeeBox(prevC.course, id)}
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
            </Box>
          ))}
        </Box>
      </List>
    </Box>
  );
};

export default CourseList;

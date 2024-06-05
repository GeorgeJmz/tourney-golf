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
import { Autocomplete, Box, TextField } from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { toJS } from "mobx";

interface ICourseList {
  lastCourse: Array<string>;
  courses: Array<IGolfCourse>;
  currentTeeBox: string;
  onOpenCourse: (id: string) => void;
  onSelectTeeBox: (course: GolfCourse, id: string) => void;
}

const CourseList: React.FC<ICourseList> = ({
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

  console.log(toJS(courses), toJS(lastCourse));
  return (
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
              {selectedCourse?.course.teeBoxes.map(({ color, length, id }) => (
                <ListItemButton
                  sx={{ pl: 4 }}
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
              ))}
            </List>
          </Collapse>
        </React.Fragment>
      )}
      <Box>
        {previousCourses.map((prevC) => (
          <Box key={prevC.course.id}>
            <ListItemButton
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
                    sx={{ pl: 4 }}
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
      {/* {courses.map(({ course, isOpen }) => (
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
                  {`${course.address}`}
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
      ))} */}
    </List>
  );
};

export default observer(CourseList);

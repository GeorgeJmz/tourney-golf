import * as React from "react";

import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import GolfCourseIcon from "@mui/icons-material/GolfCourse";
import ListItemIcon from "@mui/material/ListItemIcon";
import Modal from "@mui/material/Modal";
import ScoreViewModel from "../../../viewModels/ScoreViewModel";

interface IMatchModalProps {
  hole: number;
  par: number;
  //author: string;
  //score: number;
  isOpen: boolean;
  players: Array<ScoreViewModel>;
  onCloseModal: () => void;
  onSetScore: (temporalScores: Array<number>, hole: number) => void;
  //onUpdateScore: (value: string) => void;
}

export const MatchModal: React.FC<IMatchModalProps> = ({
  hole,
  par,
  isOpen,
  players,
  onCloseModal,
  onSetScore,
}) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    maxWidth: 600,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  const emptyScore = React.useMemo(() => {
    return Array.from({ length: players.length }, () => 0);
  }, [players.length]);

  const [temporalScores, setTemporalScores] = React.useState([...emptyScore]);

  React.useEffect(() => {
    if (!isOpen) {
      const newScores = [...emptyScore];
      setTemporalScores(newScores);
    }
    const currentHole = hole - 1;
    const newScores = [...emptyScore];
    players.forEach((player, key) => {
      const score = player.score.scoreHoles[currentHole] || par;
      newScores[key] = score;
    });
    setTemporalScores(newScores);
  }, [isOpen, hole]);

  return (
    <Modal
      open={isOpen}
      onClose={onCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <List>
          <ListItem alignItems="center" divider>
            <ListItemIcon>
              <GolfCourseIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  component="h2"
                  variant="h6"
                  fontWeight="700"
                  color="text.primary"
                >
                  {`Hole ${hole}`}
                </Typography>
              }
              secondary={
                <Typography component="h3" variant="body2" color="text.primary">
                  {`Par ${par}`}
                </Typography>
              }
            />
          </ListItem>
          {players.map((player, key) => (
            <React.Fragment>
              <ListItem alignItems="center" sx={{ p: 2 }}>
                <Typography
                  id="modal-modal-title"
                  fontWeight="700"
                  variant="h6"
                  component="h2"
                >
                  {player.score.player}
                </Typography>
              </ListItem>
              <ListItem
                alignItems="center"
                sx={{ p: 2 }}
                divider
                secondaryAction={
                  <FormGroup row>
                    <IconButton
                      color="primary"
                      onClick={() => {
                        const newScores = [...temporalScores];
                        newScores[key] = temporalScores[key] - 1;
                        if (newScores[key] < 1) {
                          newScores[key] = 1;
                        }
                        setTemporalScores(newScores);
                      }}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography variant="h5" component="h2">
                      {temporalScores[key]}
                    </Typography>
                    <IconButton
                      color="primary"
                      onClick={() => {
                        const newScores = [...temporalScores];
                        newScores[key] = temporalScores[key] + 1;
                        setTemporalScores(newScores);
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </FormGroup>
                }
              >
                <Typography
                  id="modal-modal-title"
                  fontWeight="700"
                  variant="body1"
                  component="h2"
                >
                  Score
                </Typography>
              </ListItem>
            </React.Fragment>
          ))}
          <ListItem alignItems="center">
            <FormControl margin="normal" fullWidth>
              <Button
                type="button"
                variant="contained"
                size="large"
                onClick={() => {
                  const correctHole = hole - 1;
                  onSetScore(temporalScores, correctHole);
                }}
              >
                Score
              </Button>
            </FormControl>
          </ListItem>
        </List>
      </Box>
    </Modal>
  );
};

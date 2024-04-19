import * as React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";

interface IScoreBeforeLeaveProps {
  isOpen: boolean;
  title: string;
  isFull?: boolean;
  onCloseModal: () => void;
  onSubmit: (message: string) => void;
  children?: React.ReactNode;
  fullWidth?: boolean;
}

export const ScoreBeforeLeave: React.FC<IScoreBeforeLeaveProps> = ({
  isOpen,
  title,
  onCloseModal,
  onSubmit,
  children,
  isFull,
}) => {
  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    height: isFull ? "100%" : "inherit",
    overflow: "auto",
    boxShadow: 24,
    p: 4,
  };

  const [isDisabledButton, setIsDisabledButton] = React.useState(false);
  const [message, setMessage] = React.useState("");

  return (
    <Modal
      open={isOpen}
      onClose={onCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {children}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          <TextField
            id="outlined-basic"
            label="Postgame comments"
            variant="outlined"
            placeholder="(Optional)"
            fullWidth
            multiline
            maxRows={4}
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
            }}
          />
        </Box>
        <Box
          sx={{ display: "flex", justifyContent: "center", marginTop: "10px" }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {title}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            marginTop: "10px",
          }}
        >
          <Button
            variant="contained"
            disabled={isDisabledButton}
            onClick={() => {
              setIsDisabledButton(true);
              onSubmit(message);
            }}
          >
            Yes
          </Button>
          <Button variant="contained" onClick={onCloseModal}>
            No
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

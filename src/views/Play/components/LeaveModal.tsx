import * as React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

interface ILeaveModalProps {
  isOpen: boolean;
  title: string;
  onCloseModal: () => void;
  onSubmit: () => void;
  children?: React.ReactNode;
}

export const LeaveModal: React.FC<ILeaveModalProps> = ({
  isOpen,
  title,
  onCloseModal,
  onSubmit,
  children,
}) => {
  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

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
          <Button variant="contained" onClick={onSubmit}>
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

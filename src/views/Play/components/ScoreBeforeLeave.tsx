import * as React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { set } from "firebase/database";
import { uploadIMG } from "../../../services/firebase";

interface IScoreBeforeLeaveProps {
  isOpen: boolean;
  title: string;
  pathName: string;
  fileName: string;
  isFull?: boolean;
  onCloseModal: () => void;
  onSubmit: (message: string) => void;
  children?: React.ReactNode;
  fullWidth?: boolean;
}

export const ScoreBeforeLeave: React.FC<IScoreBeforeLeaveProps> = ({
  isOpen,
  title,
  pathName,
  fileName,
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
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const [isDisabledButton, setIsDisabledButton] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [imageUploaded, setUploaded] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const size = file.size;
        const type = file.type;
        if (size > 10000000) {
          alert("File is too big!");
          return;
        }
        setFile(file);
        setUploaded(data as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmited = async () => {
    setIsDisabledButton(true);
    const url = file
      ? await uploadIMG(file, `${pathName}/${fileName}.jpeg`)
      : "";
    const htmlMessage = imageUploaded
      ? "<p>" + message + "</p>" + "<img src='" + url + "' width='300px' />"
      : message;
    onSubmit(htmlMessage);
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
        <Box textAlign="center">
          <Button
            component="label"
            role={undefined}
            variant="outlined"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
          >
            Gameday Picture
            <VisuallyHiddenInput
              accept="image/*"
              type="file"
              onChange={onFileChange}
            />
          </Button>
          {imageUploaded && (
            <Box paddingTop={2}>
              <img
                width="50px"
                height="50px"
                src={imageUploaded}
                alt="uploaded"
              />
            </Box>
          )}
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
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          <TextField
            id="outlined-basic"
            label="Leave a message"
            variant="outlined"
            placeholder="(Optional)"
            fullWidth
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
            }}
          />
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
            onClick={onSubmited}
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

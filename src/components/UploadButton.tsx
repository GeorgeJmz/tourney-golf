import * as React from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import { uploadPdf, getPdfUrl } from "../services/firebase";

interface UploadButtonProps {
  buttonText: string;
  fileName: string;
  pathName: string;
}

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

export const UploadButton: React.FC<UploadButtonProps> = ({
  buttonText,
  fileName,
  pathName,
}) => {
  const [fileUrl, setFile] = React.useState<string>("");
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await uploadPdf(file, `${pathName}/${fileName}.pdf`);
      if (url !== "") {
        setFile(url);
      }
    }
  };

  const getFile = async () => {
    const url = await getPdfUrl(`${pathName}/${fileName}.pdf`);
    if (url !== "") {
      setFile(url);
    }
  };

  React.useEffect(() => {
    getFile();
  }, [fileName]);

  return (
    <React.Fragment>
      {fileUrl !== "" && (
        <div>
          <Button
            variant="text"
            endIcon={<DownloadForOfflineIcon />}
            href={fileUrl}
            target="_blank"
          >
            Download {fileName}
          </Button>
        </div>
      )}

      <div>
        <Button
          component="label"
          variant="outlined"
          startIcon={<CloudUploadIcon />}
        >
          {buttonText}
          <VisuallyHiddenInput type="file" onChange={handleUpload} />
        </Button>
      </div>
    </React.Fragment>
  );
};

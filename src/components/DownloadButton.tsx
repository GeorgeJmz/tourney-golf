import * as React from "react";
import { Button } from "@mui/material";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import { getPdfUrl } from "../services/firebase";

interface DownloadButtonProps {
  fileName: string;
  pathName: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  fileName,
  pathName,
}) => {
  const [fileUrl, setFile] = React.useState<string>("");

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
      {fileUrl === "" && <div>No {fileName} added</div>}
    </React.Fragment>
  );
};

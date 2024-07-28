import * as React from "react";
import { Button } from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { getPdfUrl } from "../../services/firebase";

interface DownloadFileButtonProps {
  fileName: string;
  pathName: string;
}

export const DownloadFileButton: React.FC<DownloadFileButtonProps> = ({
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
            variant="outlined"
            endIcon={<FileDownloadOutlinedIcon />}
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

import { Typography } from "@mui/material";

import React from "react";
import "../../assets/fonts/MDNich.css";

interface DashboardTitleProps {
  children: React.ReactNode;
}
const DashboardTitle: React.FC<DashboardTitleProps> = ({ children }) => {
  return (
    <Typography
      gutterBottom
      align="left"
      variant="h6"
      component="div"
      sx={(theme) => ({
        color: "white",
        fontWeight: "bold",
        borderTop: "1px solid #fff",
        borderLeft: "1px solid #fff",
        paddingTop: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        textTransform: "uppercase",
      })}
    >
      {children}
    </Typography>
  );
};

export default DashboardTitle;

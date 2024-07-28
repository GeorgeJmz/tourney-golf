import { Typography } from "@mui/material";

import React from "react";
import "../../assets/fonts/MDNich.css";

interface HeaderDashboardProps {
  text: string;
}
const HeaderDashboard: React.FC<HeaderDashboardProps> = ({ text }) => {
  return (
    <Typography
      sx={{
        color: "#BDFF69",
        fontSize: 64,
        fontWeight: 600,
        fontFamily: "'MDNichromeTestBold', sans-serif",
        letterSpacing: "3px",
      }}
    >
      {text}
    </Typography>
  );
};

export default HeaderDashboard;

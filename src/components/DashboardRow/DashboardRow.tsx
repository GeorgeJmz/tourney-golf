import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import React from "react";
import type { ITournament } from "../../models/Tournament";
import DashboardTitle from "../DashboardTitle/DashboardTitle";

interface DashboardRowProps {
  title: string;
  tournaments: ITournament[];
  url: string;
}
const DashboardRow: React.FC<DashboardRowProps> = ({
  title,
  tournaments,
  url,
}) => {
  return (
    <Box width="100%">
      <DashboardTitle>{title}</DashboardTitle>
      <Box
        width="100%"
        display="flex"
        flexWrap={"wrap"}
        sx={(theme) => ({
          paddingTop: theme.spacing(1),
          paddingLeft: theme.spacing(2),
          width: "calc(100% - 16px)",
          flexWrap: "wrap",
          flexDirection: "row",
          alignItems: "center",
        })}
      >
        {tournaments.map((tournament) => (
          <Box
            sx={(theme) => ({
              maxWidth: "16%",
              minWidth: "120px",
              marginTop: theme.spacing(1),
              flexBasis: "16%",
              padding: theme.spacing(2),
              borderLeft: "1px solid",
              borderColor: theme.palette.primary.main,
            })}
          >
            <Link to={`${url}${tournament.id}`}>
              <Typography
                gutterBottom
                variant="h6"
                component="div"
                sx={{
                  lineHeight: "1",
                  color: "white",
                  fontSize: "18px",
                  textAlign: "left",
                }}
              >
                {tournament.name}
              </Typography>
            </Link>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default DashboardRow;

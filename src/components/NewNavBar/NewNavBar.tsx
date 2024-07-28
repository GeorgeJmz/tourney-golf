import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const NewNavBar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <AppBar
      sx={(theme) => ({
        backgroundColor: theme.backgrounds.dark,
      })}
      position="fixed"
    >
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            size="large"
            edge="start"
            color="primary"
            aria-label="back"
            sx={{ mr: 2 }}
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NewNavBar;

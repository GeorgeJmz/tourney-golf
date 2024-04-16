import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./hooks/useUserContext";
import { NavbarTitleProvider } from "./hooks/useNavContext";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./index.css";
import App from "./App";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  typography: {
    fontFamily: "'Raleway', sans-serif",
    subtitle1: {
      fontFamily: "'Daniel', sans-serif"
    },
    subtitle2: {
      fontFamily: "'DanielBD', sans-serif"
    },
    button: {
      fontFamily: "'RalewayBold', sans-serif"
    },
    h3: {
      fontFamily: "'BigBlackBear', sans-serif"
    }
  },
  palette: {
    mode: "dark",
    background: {
      default: "#121212", // Dark grey background
      paper: "#1e1e1e", // Slightly lighter grey for paper elements
    },
    primary: {
      main: "#bdff69",
    },
    secondary: {
      main: "#ff006b",
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <AuthProvider>
    <NavbarTitleProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </NavbarTitleProvider>
  </AuthProvider>
);

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
    fontFamily: "'Sequel-Sans', sans-serif",
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
    },
    h6: {
      fontFamily: "'BigBlackBear', sans-serif"
    },
  },
  components: {
    MuiButton: {
      variants: [
        {
          props: { size: "large" },
          style: ({ theme }) => ({
            //transition: "color 0.3s ease, box-shadow 0.3s ease",
            fontSize: 28, padding: "0.1em 0.8em",
            /*"&:hover": {
              color: theme.palette.primary.main,
              boxShadow: `-6px 6px ${theme.palette.secondary.main}`
            }*/
          }),
        }
      ],
    },
    MuiPaper: {
      variants: [
        {
          props: { variant: "outlined" },
          style: {
            background: "transparent",
            border: "0px solid white"
          }
        }
      ]
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme: {palette: {primary}} }) => ({
          backgroundColor: primary.main,
          color: primary.contrastText
        })
      }
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
      contrastText: "#000000"
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

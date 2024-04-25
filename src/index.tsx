import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { AuthProvider } from "./hooks/useUserContext";
import { NavbarTitleProvider } from "./hooks/useNavContext";
import { createTheme, responsiveFontSizes, ThemeProvider } from "@mui/material/styles";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import Welcome from "./views/Welcome/Welcome";
import Dashboard from "./views/Dashboard/Dashboard";
import CreateAccount from "./views/CreateAccount/CreateAccount";
import Login from "./views/Login/Login";
import ForgotPassword from "./views/ForgotPassword/ForgotPassword";
import PasswordReset from "./views/PasswordReset/PasswordReset";
import "./App.css";
import { RequireAuth } from "./views/Welcome/components/ProtectedRoutes";
import Router from "./Router";
import { ToastContainer } from "react-toastify";
import {Container, CssBaseline, Typography} from "@mui/material";

const theme =  responsiveFontSizes(createTheme({
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
    block: {
      fontFamily: "'BigBlackBear', sans-serif",
      fontSize: "3.4em",
      lineHeight: "1em"
    }
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
        },
        {
          props: { size: "big" },
          style: ({ theme }) => ({
            fontSize: 20, padding: "0.1em 0.8em",
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
}), {
  variants: [
    "subtitle1",
    "subtitle2",
    "button",
    "h3",
    "h6"
  ]
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <AuthProvider>
    <NavbarTitleProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App">
          <Router />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={true}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
      </ThemeProvider>
    </NavbarTitleProvider>
  </AuthProvider>
);

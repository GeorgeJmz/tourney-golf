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
import { createTheme, ThemeProvider } from "@mui/material/styles";
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

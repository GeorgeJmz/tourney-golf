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
  },
  palette: {
    primary: {
      main: "#0F934C",
    },
    secondary: {
      main: "#7FC36A",
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

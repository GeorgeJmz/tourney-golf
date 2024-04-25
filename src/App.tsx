import React from "react";
import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router-dom";
import CreateAccount from "./views/CreateAccount/CreateAccount";
import { RequireAuth } from "./views/Welcome/components/ProtectedRoutes";
import Login from "./views/Login/Login";
import Welcome from "./views/Welcome/Welcome";
import Dashboard from "./views/Dashboard/Dashboard";
import Play from "./views/Play/Play";
import { useAuth } from "./hooks/useUserContext";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import CreateTournament from "./views/CreateTournament/CreateTournament";
import UserViewModel from "./viewModels/UserViewModel";
import Tournament from "./views/Tournament/Tournament";
import { NavBar } from "./components/NavBar";
import TournamentStats from "./views/TournamentStats/TournamentStats";
import TournamentResults from "./views/TournamentResults/TournamentResults";
import Profile from "./views/Profile/Profile";
import MatchDetail from "./views/MatchDetail/MatchDetail";
import AdminLeague from "./views/AdminLeague/AdminLeague";
import ForgotPassword from "./views/ForgotPassword/ForgotPassword";
import PasswordReset from "./views/PasswordReset/PasswordReset";
import AuthUserActions from "./views/AuthUserActions/AuthUserActions";
import AuthActions from "./views/AuthActions/AuthActions";
import { useLocation } from "react-router-dom";
import MarqueeBackground from "./components/MarqueeBackground";


function App(): JSX.Element {
  const { user } = useAuth();
  const userViewModel = React.useMemo(() => new UserViewModel(), []);
  if (user) {
    userViewModel.setUser(user);
  }

  return (
    <React.Fragment>
      {/* <MarqueeBackground expanded={expanded}></MarqueeBackground> */}
      <div className="App">
        <NavBar
          isVisible={Boolean(user)}
          children={
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/create-account" element={<CreateAccount />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/password-reset" element={<PasswordReset />} />
              <Route
                path="/dashboard"
                element={
                  <RequireAuth user={user}>
                    <Dashboard user={userViewModel} />
                  </RequireAuth>
                }
              />
              <Route
                path="/create-tournament"
                element={
                  <RequireAuth user={user}>
                    <CreateTournament user={userViewModel} />
                  </RequireAuth>
                }
              />
              <Route
                path="/play"
                element={
                  <RequireAuth user={user}>
                    <Play user={userViewModel} />
                  </RequireAuth>
                }
              />
              <Route
                path="/manage-tournament/:id"
                element={
                  <RequireAuth user={user}>
                    <AdminLeague user={userViewModel} />
                  </RequireAuth>
                }
              />
              <Route
                path="/tournament/:id"
                element={
                  <RequireAuth user={user}>
                    <Tournament user={userViewModel} />
                  </RequireAuth>
                }
              />
              <Route
                path="/stats-tournament/:id"
                element={
                  <RequireAuth user={user}>
                    <TournamentStats user={userViewModel} />
                  </RequireAuth>
                }
              />
              <Route
                path="/play-tournament/:id"
                element={
                  <RequireAuth user={user}>
                    <Play user={userViewModel} />
                  </RequireAuth>
                }
              />
              <Route
                path="/results/:id"
                element={
                  <RequireAuth user={user}>
                    <TournamentResults user={userViewModel} />
                  </RequireAuth>
                }
              />
              <Route
                path="/match/:id"
                element={
                  <RequireAuth user={user}>
                    <MatchDetail user={userViewModel} />
                  </RequireAuth>
                }
              />
              <Route
                path="/edit-profile"
                element={
                  <RequireAuth user={user}>
                    <Profile user={userViewModel} />
                  </RequireAuth>
                }
              />
              <Route
                path="auth/actions"
                element={
                  <AuthActions>
                    <AuthUserActions />
                  </AuthActions>
                }
              />
            </Routes>
          }
        />

        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </React.Fragment>
  );
}

export default App;

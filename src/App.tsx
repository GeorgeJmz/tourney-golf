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
import { NavBar } from "./components/NavBar";

function App(): JSX.Element {
  const { user } = useAuth();
  const userViewModel = React.useMemo(() => new UserViewModel(), []);
  if (user) {
    userViewModel.setUser(user);
  }

  return (
    <div className="App">
      <NavBar
        isVisible={Boolean(user)}
        children={
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/login" element={<Login />} />
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
  );
}

export default App;

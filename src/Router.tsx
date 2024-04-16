import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useAuth } from "./hooks/useUserContext";
import UserViewModel from "./viewModels/UserViewModel";
import Login from "./views/Login/Login";
import Welcome from "./views/Welcome/Welcome";
import Dashboard from "./views/Dashboard/Dashboard";
import Play from "./views/Play/Play";
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
import CreateAccount from "./views/CreateAccount/CreateAccount";
import { RequireAuth } from "./views/Welcome/components/ProtectedRoutes";
import CreateTournament from "./views/CreateTournament/CreateTournament";

function Router(): JSX.Element {
  const { user } = useAuth();
  const userViewModel = React.useMemo(() => new UserViewModel(), []);
  if (user) {
    userViewModel.setUser(user);
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <NavBar isVisible={Boolean(user)} />,
      children: [
        { path: "/", element: <Welcome /> },
        { path: "/create-account", element: <CreateAccount /> },
        { path: "/login", element: <Login /> },
        { path: "/forgot-password", element: <ForgotPassword /> },
        { path: "/password-reset", element: <PasswordReset /> },
        {
          path: "/dashboard",
          element: (
            <RequireAuth user={user}>
              <Dashboard user={userViewModel} />
            </RequireAuth>
          ),
        },
        {
          path: "/create-tournament",
          element: (
            <RequireAuth user={user}>
              <CreateTournament user={userViewModel} />
            </RequireAuth>
          ),
        },
        {
          path: "/play",
          element: (
            <RequireAuth user={user}>
              <Play user={userViewModel} />
            </RequireAuth>
          ),
        },
        {
          path: "/manage-tournament/:id",
          element: (
            <RequireAuth user={user}>
              <AdminLeague user={userViewModel} />
            </RequireAuth>
          ),
        },

        {
          path: "/tournament/:id",
          element: (
            <RequireAuth user={user}>
              <Tournament user={userViewModel} />
            </RequireAuth>
          ),
        },
        {
          path: "/stats-tournament/:id",
          element: (
            <RequireAuth user={user}>
              <TournamentStats user={userViewModel} />
            </RequireAuth>
          ),
        },
        {
          path: "/play-tournament/:id",
          element: (
            <RequireAuth user={user}>
              <Play user={userViewModel} />
            </RequireAuth>
          ),
        },
        {
          path: "/results/:id",
          element: (
            <RequireAuth user={user}>
              <TournamentResults user={userViewModel} />
            </RequireAuth>
          ),
        },
        {
          path: "/match/:id",
          element: (
            <RequireAuth user={user}>
              <MatchDetail user={userViewModel} />
            </RequireAuth>
          ),
        },
        {
          path: "/edit-profile",
          element: (
            <RequireAuth user={user}>
              <Profile user={userViewModel} />
            </RequireAuth>
          ),
        },
        {
          path: "auth/actions",
          element: (
            <AuthActions>
              <AuthUserActions />
            </AuthActions>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default Router;

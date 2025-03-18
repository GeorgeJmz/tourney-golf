import React, { useMemo } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  RouteObject,
} from "react-router-dom";
import { useAuth } from "./hooks/useUserContext";
import UserViewModel from "./viewModels/UserViewModel";
import { NavBar } from "./components/NavBar";
import { RequireAuth } from "./views/Welcome/components/ProtectedRoutes";

// Importaciones de Vistas
import Login from "./views/Login/Login";
import Welcome from "./views/Welcome/Welcome";
import Dashboard from "./views/Dashboard/Dashboard";
import Play from "./views/Play/Play";
import Tournament from "./views/Tournament/Tournament";
import TournamentStats from "./views/TournamentStats/TournamentStats";
import TournamentDogfightStats from "./views/TournamentStats/DogfightStats";
import TournamentResults from "./views/TournamentResults/TournamentResults";
import TournamentResultsDogfight from "./views/TournamentResults/DogfightResults";
import Profile from "./views/Profile/Profile";
import MatchDetail from "./views/MatchDetail/MatchDetail";
import AdminLeague from "./views/AdminLeague/AdminLeague";
import ForgotPassword from "./views/ForgotPassword/ForgotPassword";
import PasswordReset from "./views/PasswordReset/PasswordReset";
import AuthUserActions from "./views/AuthUserActions/AuthUserActions";
import AuthActions from "./views/AuthActions/AuthActions";
import CreateAccount from "./views/CreateAccount/CreateAccount";
import CreateTournament from "./views/CreateTournament/CreateTournament";
import Rules from "./views/Rules/Rules";
import Dogfight from "./views/Play/Dogfight";
import PlayOffsPlayer from "./views/PlayOffs/PlayOffsPlayer";
import HistoryLeague from "./views/HistoryLeague/HistoryLeague";
import Teamplay from "./views/Play/Teamplay";
import TeamBoard from "./views/TournamentStats/TeamBoard";
import PlayerBoard from "./views/TournamentStats/PlayerBoard";
import HistoryLeagueTeamplay from "./views/HistoryLeague/HistoryLeagueTeamplay";
import Stats from "./views/Stats/Stats";

function Router(): JSX.Element {
  const { user } = useAuth();
  const userViewModel = useMemo(() => {
    const vm = new UserViewModel();
    if (user) {
      vm.setUser(user);
    }
    return vm;
  }, [user]);

  // Centralizar la lógica de RequireAuth
  const withAuth = (element: JSX.Element) => (
    <RequireAuth user={user}>{element}</RequireAuth>
  );

  const routes: RouteObject[] = [
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
          element: withAuth(<Dashboard user={userViewModel} />),
        },
        {
          path: "/create-tournament",
          element: withAuth(<CreateTournament user={userViewModel} />),
        },
        { path: "/play", element: withAuth(<Play user={userViewModel} />) },
        {
          path: "/manage-tournament/:id",
          element: withAuth(<AdminLeague user={userViewModel} />),
        },
        {
          path: "/history-league/:id",
          element: withAuth(<HistoryLeague user={userViewModel} />),
        },
        {
          path: "/history-league-teamplay/:id",
          element: withAuth(<HistoryLeagueTeamplay user={userViewModel} />),
        },
        {
          path: "/tournament/:id",
          element: withAuth(<Tournament user={userViewModel} />),
        },
        {
          path: "/stats-tournament/:id",
          element: withAuth(<TournamentStats user={userViewModel} />),
        },
        {
          path: "/stats/:id",
          element: withAuth(<Stats user={userViewModel} />),
        },
        {
          path: "/playoffs-tournament/:id",
          element: withAuth(<PlayOffsPlayer user={userViewModel} />),
        },
        {
          path: "/stats-tournament-dogfight/:id",
          element: withAuth(<TournamentDogfightStats user={userViewModel} />),
        },
        {
          path: "/rules-tournament/:id",
          element: withAuth(<Rules user={userViewModel} />),
        },
        {
          path: "/play-tournament/:id",
          element: withAuth(<Play user={userViewModel} />),
        },
        {
          path: "/play-tournament-dogfight/:id",
          element: withAuth(<Dogfight user={userViewModel} />),
        },
        {
          path: "/play-tournament-team/:id",
          element: withAuth(<Teamplay user={userViewModel} />),
        },
        {
          path: "/results/:id",
          element: withAuth(<TournamentResults user={userViewModel} />),
        },
        {
          path: "/team-board/:id",
          element: withAuth(<TeamBoard user={userViewModel} />),
        },
        {
          path: "/player-board/:id",
          element: withAuth(<PlayerBoard user={userViewModel} />),
        },
        {
          path: "/results-dogfight/:id",
          element: withAuth(<TournamentResultsDogfight user={userViewModel} />),
        },
        {
          path: "/match/:id",
          element: withAuth(<MatchDetail user={userViewModel} />),
        },
        {
          path: "/edit-profile",
          element: withAuth(<Profile user={userViewModel} />),
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
  ];

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
}

export default Router;

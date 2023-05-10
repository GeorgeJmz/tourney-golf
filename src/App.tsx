import React from "react";
import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router-dom";
import CreateAccount from "./views/CreateAccount/CreateAccount";
import { RequireAuth } from "./views/Welcome/components/ProtectedRoutes";
import Login from "./views/Login/Login";
import Welcome from "./views/Welcome/Welcome";
import Dashboard from "./views/Dashboard/Dashboard";
import { useAuth } from "./hooks/useUserContext";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

function App(): JSX.Element {
  const { user } = useAuth();
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth user={user}>
              <Dashboard />
            </RequireAuth>
          }
        />
      </Routes>
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

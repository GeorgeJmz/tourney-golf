import React from "react";
import { observer } from "mobx-react";
import UserViewModel from "../../viewModels/UserViewModel";
import LoginForm from "./components/LoginForm/LoginForm";
import { Navigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useUserContext";

const Login: React.FC = () => {
  const userViewModel = new UserViewModel();
  const location = useLocation();
  const { user } = useAuth();

  return (
    <div>
      {user && <Navigate to="/dashboard" state={{ from: location }} replace />}
      {!user && (
        <div>
          <LoginForm userViewModel={userViewModel} />
          <p>Don't have an account?</p>
          <Link to="/create-account">
            <button>Create an account</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default observer(Login);

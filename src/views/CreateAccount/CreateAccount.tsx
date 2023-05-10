import React from "react";
import { observer } from "mobx-react";
import CreateAccountForm from "./components/CreateAccountForm/CreateAccountForm";
import UserViewModel from "../../viewModels/UserViewModel";
import { Navigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useUserContext";

const CreateAccount: React.FC = () => {
  const userViewModel = new UserViewModel();
  const location = useLocation();
  const { user } = useAuth();
  return (
    <div>
      {user && <Navigate to="/dashboard" state={{ from: location }} replace />}
      {!user && (
        <div>
          <CreateAccountForm userViewModel={userViewModel} />
          <p>Have an account?</p>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default observer(CreateAccount);

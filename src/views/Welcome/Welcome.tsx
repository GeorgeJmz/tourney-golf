import React from "react";
import { observer } from "mobx-react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useUserContext";

const Welcome: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  return (
    <div>
      {user && <Navigate to="/dashboard" state={{ from: location }} replace />}
      {!user && (
        <div>
          <Link to="/create-account">
            <button>Create an Account</button>
          </Link>
          <p>Have an account?</p>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default observer(Welcome);

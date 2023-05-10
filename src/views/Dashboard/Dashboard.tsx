import React from "react";
import { observer } from "mobx-react";
import { logout } from "../../services/firebase";
import { useAuth } from "../../hooks/useUserContext";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  return (
    <div>
      {user && (
        <div>
          <p>Welcome </p>
          <p>
            {user.name} {user.lastName}
          </p>
          <p>{user.email}</p>
        </div>
      )}
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default observer(Dashboard);

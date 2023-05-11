import React, {
  ReactNode,
  useEffect,
  useState,
  useContext,
  createContext,
} from "react";
import { auth, getUserByUID } from "../services/firebase";
import type { Auth } from "firebase/auth";
import { IUser } from "../models/User";

export interface AuthProviderProps {
  children?: ReactNode;
}

export interface UserContextState {
  isAuthenticated: boolean;
  isLoading: boolean;
  id?: string;
}

export const UserStateContext = createContext<UserContextState>(
  {} as UserContextState
);
export interface AuthContextModel {
  auth: Auth;
  user: IUser | null;
}

export const AuthContext = React.createContext<AuthContextModel>(
  {} as AuthContextModel
);

export function useAuth(): AuthContextModel {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const unsuscribe = auth.onAuthStateChanged(async (user) => {
      let activeUser = null;
      if (user) {
        activeUser = await getUserByUID(user.uid);
      }
      setUser(activeUser);
    });
    return unsuscribe;
  }, []);

  const values: AuthContextModel = {
    user: user,
    auth,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useUserContext = (): UserContextState => {
  return useContext(UserStateContext);
};

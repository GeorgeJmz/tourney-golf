import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import type { IUser } from "../../../models/User";

export function RequireAuth({
  children,
  user,
}: {
  children: JSX.Element;
  user: IUser | null;
}) {
  const location = useLocation();
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

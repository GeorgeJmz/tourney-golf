import React from "react";
import { observer } from "mobx-react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useUserContext";
import { Button, Stack, Typography, Paper, Container } from "@mui/material";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { AppDownload } from "./components/AppDownload";
import { Footer } from "./components/FooterWelcome";
const Welcome: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  return (
    <React.Fragment>
      {user && <Navigate to="/dashboard" state={{ from: location }} replace />}
      {!user && (
        <>
          <Hero />
          <Features />
          <AppDownload />
          <Footer />
        </>
      )}
    </React.Fragment>
  );
};

export default observer(Welcome);

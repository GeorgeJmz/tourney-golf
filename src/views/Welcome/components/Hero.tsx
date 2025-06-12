import React from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  CssBaseline,
  ThemeProvider,
  createTheme,
  styled,
} from "@mui/material";
import { Link, Navigate, useLocation } from "react-router-dom";

import { ReactComponent as TeeBoxLogo } from "../../../assets/teebox.svg";
const fadeIn = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const AnimatedBox = styled(Box)<{ delay?: number }>(({ delay = 0 }) => ({
  animation: "fadeIn 0.8s ease-out forwards",
  animationDelay: `${delay}s`,
  opacity: 0,
}));
export const Hero = () => (
  <Box
    component="section"
    sx={{
      position: "relative",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(to bottom right, #14532d, #111827, #000000)", // from-green-900 via-gray-900 to-black
      color: "common.white",
      overflow: "hidden",
      textAlign: "center",
      px: 3,
    }}
  >
    <style>{fadeIn}</style>
    <Box sx={{ position: "absolute", inset: 0, opacity: 0.1 }}>
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "10%",
          width: 128,
          height: 128,
          border: "2px solid white",
          transform: "rotate(45deg)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "20%",
          right: "15%",
          width: 96,
          height: 96,
          border: "2px solid #4ade80",
          transform: "rotate(12deg)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "25%",
          width: 64,
          height: 64,
          border: "1px solid white",
          borderRadius: "50%",
        }}
      />
    </Box>

    <Container maxWidth="md" sx={{ position: "relative", zIndex: 10 }}>
      <AnimatedBox>
        <Box
          sx={{
            width: 150,
            height: 150,
            mx: "auto",
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "& svg": {
              width: "100%",
              height: "100%",
              display: "block",
              "& path": {
                fill: "white",
              },
            },
          }}
        >
          <TeeBoxLogo />
        </Box>
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontSize: { xs: "3.75rem", md: "4.5rem" },
            mb: 2,
          }}
        >
          TEE BOX{" "}
          <Typography
            component="span"
            variant="inherit"
            sx={{ color: "#4ade80" }}
          >
            LEAGUE
          </Typography>
        </Typography>
      </AnimatedBox>

      <AnimatedBox delay={0.3}>
        <Typography
          variant="h5"
          component="p"
          sx={{
            fontSize: { xs: "1.25rem", md: "1.5rem" },
            mb: 1,
            color: "grey.300",
          }}
        >
          Practice with purpose - Play with an edge
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "#4ade80",
            fontWeight: 600,
            fontSize: { xs: "1.1rem", md: "1.25rem" },
            mb: 4,
          }}
        >
          Be a league legend
        </Typography>
      </AnimatedBox>

      <AnimatedBox delay={0.6}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            sx={{
              bgcolor: "primary.main",
              "&:hover": {
                bgcolor: "secondary.main",
                transform: "scale(1.05)",
              },
              px: 4,
              py: "12px",
              fontSize: "1.125rem",
              fontWeight: 600,
              borderRadius: "8px",
              transition: "all 0.3s",
              textTransform: "none",
            }}
          >
            Download Now
          </Button>
          <Link to="/login">
            <Button
              variant="contained"
              sx={{
                bgcolor: "primary.main",
                "&:hover": {
                  bgcolor: "secondary.main",
                  transform: "scale(1.05)",
                },
                px: 4,
                py: "12px",
                fontSize: "1.125rem",
                fontWeight: 600,
                borderRadius: "8px",
                transition: "all 0.3s",
                textTransform: "none",
              }}
            >
              Login
            </Button>
          </Link>
          <Link to="/create-account">
            <Button
              variant="outlined"
              sx={{
                borderColor: "common.white",
                color: "common.white",
                "&:hover": {
                  bgcolor: "common.white",
                  color: "common.black",
                  borderColor: "common.white",
                },
                px: 4,
                py: "12px",
                fontSize: "1.125rem",
                fontWeight: 600,
                borderRadius: "8px",
                transition: "all 0.3s",
                textTransform: "none",
              }}
            >
              Create an Account
            </Button>
          </Link>
        </Box>
      </AnimatedBox>

      <AnimatedBox delay={0.9} sx={{ mt: 8 }}>
        <Typography sx={{ fontSize: "0.875rem", color: "grey.400", mb: 2 }}>
          Experience the power of digital golf scoring
        </Typography>
      </AnimatedBox>
    </Container>
  </Box>
);

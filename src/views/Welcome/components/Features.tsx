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
import { FeatureCard } from "./FeatureCard";
export const Features = () => {
  const featureData = [
    {
      title: "Manage your league in TBL",
      description:
        "Determine the length of the season, number of rounds and points per win / draw",
      imgSrc: "/league_details_standings_screen.png",
      alt: "Manage your league in TBL",
    },
    {
      title: "Immediate Scoring Notifications",
      description:
        "Players upload their scores and league-wide results notifications are sent.",
      imgSrc: "/score_screen.png",
      alt: "Immediate Scoring Notifications",
      reverse: true,
    },
    {
      title: "Leaderboards",
      description:
        "Comprehensive stats and analytics with live individual and team leaderboards",
      imgSrc: "/board_screen.png",
      alt: "Leaderboards",
    },
  ];

  return (
    <Box component="section" sx={{ py: 10, bgcolor: "background.default" }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 10 }}>
          <Typography
            variant="h2"
            sx={{ mb: 2, fontSize: { xs: "2.25rem", md: "3rem" } }}
          >
            You’re ready to start your golf season
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "1.125rem", md: "1.25rem" },
              color: "text.secondary",
              maxWidth: "48rem",
              mx: "auto",
            }}
          >
            TBL manages several types of golf leagues, all designed to promote
            competitive play and deliver a sought-after outcome: your name in
            the winners circle and bragging rights that last a lifetime
          </Typography>
        </Box>
        {featureData.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </Container>
    </Box>
  );
};

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
      title: "League Management",
      description:
        "Create and manage golf leagues with ease. Track standings, organize tournaments, and build competitive communities.",
      imgSrc: "/select_course_screen.png",
      alt: "League Management",
    },
    {
      title: "Live Scoring",
      description:
        "Real-time score tracking with intuitive hole-by-hole input. Never lose track of your game again.",
      imgSrc: "/score_screen.png",
      alt: "Live Scoring",
      reverse: true,
    },
    {
      title: "Detailed Statistics",
      description:
        "Comprehensive stats and analytics to improve your game. Track handicaps, course performance, and progress over time.",
      imgSrc: "/score_dialog.png",
      alt: "Detailed Statistics",
    },
    {
      title: "Course Selection",
      description:
        "Choose from a wide variety of golf courses. Find your favorite courses and discover new challenges.",
      imgSrc: "/select_opponent_screen.png",
      alt: "Course Selection",
      reverse: true,
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
            Everything You Need for Golf
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "1.125rem", md: "1.25rem" },
              color: "text.secondary",
              maxWidth: "48rem",
              mx: "auto",
            }}
          >
            From casual rounds to competitive leagues, TEE BOX LEAGUE provides
            all the tools you need to elevate your golf experience.
          </Typography>
        </Box>
        {featureData.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </Container>
    </Box>
  );
};

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

import { ReactComponent as AppDownloadButton } from "../../../assets/appstore.svg";

const AnimatedBox = styled(Box)<{ delay?: number }>(({ delay = 0 }) => ({
  animation: "fadeIn 0.8s ease-out forwards",
  animationDelay: `${delay}s`,
  opacity: 0,
}));
export const AppDownload = () => (
  <Box
    component="section"
    sx={{
      py: 10,
      background: "linear-gradient(to right, #16a34a, #15803d)",
      color: "common.white",
      textAlign: "center",
    }}
  >
    <Container maxWidth="md">
      <AnimatedBox>
        <Typography
          variant="h2"
          sx={{ mb: 3, fontSize: { xs: "2.25rem", md: "3rem" } }}
        >
          Ready to Transform Your Golf Game?
        </Typography>
      </AnimatedBox>
      <AnimatedBox delay={0.3}>
        <Typography
          sx={{
            fontSize: { xs: "1.1rem", md: "1.25rem" },
            mb: 6,
            opacity: 0.9,
          }}
        >
          Join thousands of golfers who have already elevated their game with
          TEE BOX LEAGUE
        </Typography>
      </AnimatedBox>
      <AnimatedBox delay={0.6}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 3,
            justifyContent: "center",
            alignItems: "center",
            mb: 6,
          }}
        >
          <AppDownloadButton />
        </Box>
      </AnimatedBox>
    </Container>
  </Box>
);

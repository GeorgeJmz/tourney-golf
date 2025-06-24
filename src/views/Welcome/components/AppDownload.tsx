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
import { ReactComponent as AndroidDownloadButton } from "../../../assets/googleplay.svg";

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
          Practice with purpose, play with an edge, and become a league legend
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
          <AndroidDownloadButton />
        </Box>
      </AnimatedBox>
    </Container>
  </Box>
);

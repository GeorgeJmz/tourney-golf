import { Grid, Typography, Box, styled } from "@mui/material";
const AnimatedBox = styled(Box)<{ delay?: number }>(({ delay = 0 }) => ({
  animation: "fadeIn 0.8s ease-out forwards",
  animationDelay: `${delay}s`,
  opacity: 0,
}));
export const FeatureCard = ({
  title,
  description,
  imgSrc,
  alt,
  reverse = false,
}: {
  title: string;
  description: string;
  imgSrc: string;
  alt: string;
  reverse?: boolean;
}) => (
  <Grid
    container
    spacing={6}
    alignItems="center"
    direction={reverse ? "row-reverse" : "row"}
    sx={{ mb: 8 }}
  >
    <Grid item md={6}>
      <AnimatedBox>
        <Typography
          variant="h3"
          sx={{ mb: 2, fontSize: { xs: "1.75rem", md: "2rem" } }}
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            color: "text.secondary",
            lineHeight: 1.7,
          }}
        >
          {description}
        </Typography>
      </AnimatedBox>
    </Grid>
    <Grid item md={6}>
      <AnimatedBox>
        <Box
          sx={{
            bgcolor: "common.black",
            borderRadius: "24px",
            p: 1,
            boxShadow: 20,
            transition: "transform 0.3s",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        >
          <img
            src={imgSrc}
            alt={alt}
            style={{
              width: "75%",
              height: "auto",
              borderRadius: "16px",
              display: "block",
              margin: "0 auto",
            }}
          />
        </Box>
      </AnimatedBox>
    </Grid>
  </Grid>
);

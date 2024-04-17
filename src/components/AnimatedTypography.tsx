import { Typography, alpha, styled } from "@mui/material";
import {observer} from "mobx-react";
import { TypographyProps } from "@mui/material/Typography";

const textShadowWidth = 6;

const AnimatedTypography = styled(Typography)<TypographyProps & {animation?: "still" | "hover"}>(({ theme, animation }) => ({
    transition: "color 0.5s ease, text-shadow 0.5s ease, transform 0.5s ease",
    cursor: "pointer",
    ...(animation === "still" ? {
      color: theme.palette.primary.main,
    } : {
      "&:hover": {
        color: theme.palette.primary.main,
        textShadow: `-${textShadowWidth}px ${textShadowWidth}px ${alpha(theme.palette.secondary.main, 0.5)}`,
        transform: `translate(${textShadowWidth / 2}px, -${textShadowWidth / 2}px)`,
      }
    })
}));
export default observer(AnimatedTypography);
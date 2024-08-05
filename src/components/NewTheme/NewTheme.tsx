import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import NewNavBar from "../NewNavBar/NewNavBar";
import "../../assets/fonts/inter.css";

declare module "@mui/material/styles" {
  interface Theme {
    backgrounds: {
      dark: string;
      darkgray: string;
      light: string;
      green: string;
      lightgray: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    backgrounds?: {
      dark?: string;
      darkgray?: string;
      light?: string;
      green?: string;
    };
  }
}

const theme = createTheme({
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
  backgrounds: {
    dark: "#000000",
    darkgray: "#424242",
    light: "#fff",
    green: "BDFF69",
  },
  palette: {
    primary: {
      main: "#FFFFFF",
    },
    secondary: {
      main: "#F90066",
    },
    success: {
      main: "#BDFF69",
    },
    mode: "dark",
    background: { paper: "#424242" },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "--TextField-brandBorderColor": "#E0E3E7",
          "--TextField-brandBorderHoverColor": "#B2BAC2",
          "--TextField-brandBorderFocusedColor": "#FFF",
          "& label.Mui-focused": {
            color: "var(--TextField-brandBorderFocusedColor)",
          },
          "MuiInputLabel-root": {
            color: "var(--TextField-brandBorderFocusedColor)",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: "var(--TextField-brandBorderColor)",
        },
        root: {
          [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: "var(--TextField-brandBorderHoverColor)",
          },
          [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: "var(--TextField-brandBorderFocusedColor)",
          },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          "&::before, &::after": {
            borderBottom: "2px solid var(--TextField-brandBorderColor)",
          },
          "&:hover:not(.Mui-disabled, .Mui-error):before": {
            borderBottom: "2px solid var(--TextField-brandBorderHoverColor)",
          },
          "&.Mui-focused:after": {
            borderBottom: "2px solid var(--TextField-brandBorderFocusedColor)",
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          "&::before": {
            borderBottom: "2px solid var(--TextField-brandBorderColor)",
          },
          "&:hover:not(.Mui-disabled, .Mui-error):before": {
            borderBottom: "2px solid var(--TextField-brandBorderHoverColor)",
          },
          "&.Mui-focused:after": {
            borderBottom: "2px solid var(--TextField-brandBorderFocusedColor)",
          },
        },
      },
    },
  },
});

const NewTheme: React.FC<{ children?: React.ReactNode; hideNav?: boolean }> = ({
  children,
  hideNav,
}) => {
  const location = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={(theme) => ({
          backgroundColor: theme.backgrounds.dark,
        })}
      >
        {!hideNav && <NewNavBar />}
        {children}
      </Box>
    </ThemeProvider>
  );
};

export default NewTheme;

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#34495F", // deep blue-gray
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#EE9480", // coral
      contrastText: "#ffffff",
    },
    info: {
      main: "#A4BAB7", // muted teal-gray
    },
    warning: {
      main: "#EFF2C0", // soft yellow
      contrastText: "#34495F",
    },
    text: {
      primary: "#34495F",
      secondary: "#353d3c",
      light: "#ffff"
    },
    background: {
      default: "#ffffff",
      paper: "#f7f7f8",
    },
  },
  typography: {
    fontFamily: "Inter, Roboto, sans-serif",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    button: {
      fontWeight: "bold",
      textTransform: "none",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "0.7rem 1.5rem",
        },
        containedPrimary: {
          backgroundColor: "#34495F",
          "&:hover": {
            backgroundColor: "#2c3e50",
          },
        },
        containedSecondary: {
          backgroundColor: "#EE9480",
          "&:hover": {
            backgroundColor: "#d87e6d",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

export default theme;

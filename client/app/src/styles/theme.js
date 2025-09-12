import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#9192FF", // main-purple
        },
        secondary: {
            main: "#FEB649", // main-orange
        },
        warning: {
            main: "#FCE51C", // main-yellow
        },
        text: {
            primary: "#34495F", // main-gray
            secondary: "#9192FF",
        },
        background: {
            default: "#fff",
            paper: "#fff",
        },
    },
    typography: {
        fontFamily: "Inter, Roboto, sans-serif",
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
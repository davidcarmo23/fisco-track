import { Box } from "@mui/material";
import NavBar from "./NavBar";

function Layout({ children }) {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 260,
          bgcolor: "background.primary",
          color: "white",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <NavBar />
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.secondary",
          p: 3,
          overflowY: "auto",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default Layout;

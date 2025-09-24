import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import api from "../../api";

import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Avatar,
  Collapse,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import ReceiptIcon from "@mui/icons-material/Receipt";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import LogoutIcon from "@mui/icons-material/Logout";
import CategoryIcon from '@mui/icons-material/Category';
import LabelIcon from '@mui/icons-material/Label';

const drawerWidth = 260;

function NavBar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    api
      .get("/api/user/")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const mainLinks = [
    { to: "/", label: "Dashboard", icon: <HomeIcon /> },
    { to: "/expenses", label: "Expenses", icon: <ReceiptIcon /> },
    { to: "/invoices", label: "Invoices", icon: <InsertDriveFileIcon /> },
    { to: "/receipts", label: "Receipts", icon: <RequestQuoteIcon /> },
    { to: "/categories", label: "Categories", icon: <CategoryIcon /> },
    { to: "/priorities", label: "Priorities", icon: <LabelIcon /> },
  ];

  const secondaryLinks = [
    // { to: "/help", label: "Help", icon: <HelpOutlineIcon /> },
    // { to: "/notifications", label: "Notifications", icon: <NotificationsIcon /> },
    { to: "/settings", label: "Settings", icon: <SettingsIcon /> },
  ];

  const handleLogout = () => {
    api.post("/api/logout/").finally(() => {
      localStorage.clear();
      window.location.href = "/login";
    });
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "primary.main", // dark gray background
            color: "common.white",   // make all text/icons white by default
            borderRight: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            p: 0,
          },
        }}
      >
        {/* Top brand + nav */}
        <Box>
          <Box sx={{ p: 2 }}>
            <Typography
              variant="h6"
              color="common.white"
              fontWeight="bold"
            >
              FiscoTrack
            </Typography>
          </Box>

          <List>
            {mainLinks.map((link) => (
              <ListItemButton
                key={link.to}
                component={NavLink}
                to={link.to}
                sx={{
                  color: "common.white",
                  "& .MuiListItemIcon-root": { color: "common.white" },
                  "&:hover": {
                    bgcolor: "secondary.main",
                    color: "common.white",
                    "& .MuiListItemIcon-root": { color: "common.white" },
                  },
                  "&.active": {
                    bgcolor: "secondary.main",
                    color: "common.white",
                    "& .MuiListItemIcon-root": { color: "common.white" },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{link.icon}</ListItemIcon>
                <ListItemText primary={link.label} />
              </ListItemButton>

            ))}
          </List>
        </Box>

        {/* Bottom user section + inline slide menu */}
        {user && (
          <Box>
            <Box
              role="button"
              tabIndex={0}
              onClick={toggleMenu}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleMenu();
                }
              }}
              sx={{
                p: 2,
                borderTop: "1px solid rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                "&:hover": { bgcolor: "secondary.main" },
                userSelect: "none",
              }}
            >
              <Avatar alt={user.username} src={user.avatar || ""} />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body1" color="common.white">
                  {user.username}
                </Typography>
                <Typography variant="caption" color="rgba(255,255,255,0.7)">
                  {user.role || "User"}
                </Typography>
              </Box>
              <ExpandLessIcon
                sx={{
                  color: "common.white",
                  transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 200ms",
                }}
              />
            </Box>

            <Collapse in={menuOpen} timeout={200} unmountOnExit>
              <Box sx={{ width: "100%", borderTop: "1px solid rgba(255,255,255,0.2)", bgcolor: "primary.main" }}>
                <List disablePadding>
                  {secondaryLinks.map((link) => (
                    <ListItemButton
                      key={link.to}
                      component={NavLink}
                      to={link.to}
                      onClick={closeMenu}
                      sx={{
                        color: "common.white",
                        "& .MuiListItemIcon-root": { color: "common.white" },
                        "&:hover": {
                          bgcolor: "secondary.main",
                          color: "common.white",
                          "& .MuiListItemIcon-root": { color: "common.white" },
                        },
                        "&.active": {
                          bgcolor: "secondary.main",
                          color: "common.white",
                          "& .MuiListItemIcon-root": { color: "common.white" },
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>{link.icon}</ListItemIcon>
                      <ListItemText primary={link.label} />
                    </ListItemButton>
                  ))}

                  <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)" }} />

                  <ListItemButton
                    onClick={() => {
                      closeMenu();
                      handleLogout();
                    }}
                    sx={{
                      color: "common.white",
                      "& .MuiListItemIcon-root": { color: "common.white" },
                      "&:hover": {
                        bgcolor: "secondary.main",
                        color: "common.white",
                        "& .MuiListItemIcon-root": { color: "common.white" },
                      },
                      "&.active": {
                        bgcolor: "secondary.main",
                        color: "common.white",
                        "& .MuiListItemIcon-root": { color: "common.white" },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <LogoutIcon sx={{ color: "#EE9480" }} />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </ListItemButton>

                </List>
              </Box>
            </Collapse>
          </Box>
        )}
      </Drawer>

    </>
  );
}

export default NavBar;
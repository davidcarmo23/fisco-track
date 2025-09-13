import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import api from "../api";

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Menu,
  MenuItem,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import ReceiptIcon from "@mui/icons-material/Receipt";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import FaceIcon from "@mui/icons-material/Face";

function NavBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    api
      .get("/api/user/")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <AppBar position="static" color="primary" sx={{marginBottom: "15px"}}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", marginX: 5 }}>
          {/* Brand */}
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "inherit" }}
          >
            FiscoTrack
          </Typography>

          {/* Desktop links */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            <Button
              component={NavLink}
              to="/"
              color="inherit"
              startIcon={<HomeIcon />}
            >
              Home
            </Button>
            <Button component={NavLink} to="/expenses" color="inherit">
              Expenses
            </Button>
            <Button component={NavLink} to="/invoices" color="inherit">
              Invoices
            </Button>
            <Button component={NavLink} to="/receipts" color="inherit">
              Receipts
            </Button>
          </Box>

          {/* Mobile menu button */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* User menu */}
          {user && (
            <Box>
              <IconButton
                size="large"
                color="inherit"
                onClick={handleMenu}
                sx={{ ml: 1 }}
              >
                <FaceIcon sx={{ mr: 1 }} />
                <Typography variant="body1">{user.username}</Typography>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  component={NavLink}
                  to="/settings"
                  onClick={handleClose}
                >
                  Settings
                </MenuItem>
                <MenuItem
                  component={NavLink}
                  to="/logout"
                  onClick={handleClose}
                >
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile navigation */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        Paper={{
          sx: {
            width: { xs: "100%", sm: 280 },
            bgcolor: "background.paper",
            color: "text.primary",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Menu
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />

        <List>
          <ListItem
            button
            component={NavLink}
            to="/"
            onClick={() => setDrawerOpen(false)}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem
            button
            component={NavLink}
            to="/expenses"
            onClick={() => setDrawerOpen(false)}
          >
            <ListItemIcon>
              <ReceiptIcon />
            </ListItemIcon>
            <ListItemText primary="Expenses" />
          </ListItem>
          <ListItem
            button
            component={NavLink}
            to="/invoices"
            onClick={() => setDrawerOpen(false)}
          >
            <ListItemIcon>
              <InsertDriveFileIcon />
            </ListItemIcon>
            <ListItemText primary="Invoices" />
          </ListItem>
          <ListItem
            button
            component={NavLink}
            to="/receipts"
            onClick={() => setDrawerOpen(false)}
          >
            <ListItemIcon>
              <RequestQuoteIcon />
            </ListItemIcon>
            <ListItemText primary="Receipts" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}

export default NavBar;

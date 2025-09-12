import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Stack,
} from "@mui/material";

function AuthForm({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (method === "login") {
        const res = await api.post(route, { username, password });
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      } else {
        await api.post(route, {
          username,
          password,
          firstName,
          lastName,
          email,
        });
        navigate("/login");
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: "100%",
        maxWidth: 400,
        p: 4,
        borderRadius: 3,
        bgcolor: "background.paper",
        boxShadow: 4,
      }}
    >
      <Typography
        variant="h5"
        align="center"
        color="text.primary"
        gutterBottom
      >
        {method === "login" ? "Hello!" : "Register"}
      </Typography>

      <Stack spacing={2}>
        {method === "register" && (
          <>
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </>
        )}

        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : method === "login" ? "Login" : "Register"}
        </Button>

        {method === "login" ? (
          <Stack direction="row" justifyContent="space-between">
            <NavLink to="/register">Sign Up to Get Started</NavLink>
            <NavLink to="/reset_password">Forgot Password?</NavLink>
          </Stack>
        ) : (
          <NavLink to="/login" style={{ textAlign: "center" }}>
            Already have an account?
          </NavLink>
        )}
      </Stack>
    </Box>
  );
}

export default AuthForm;

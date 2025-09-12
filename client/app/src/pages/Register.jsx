// src/pages/Register.jsx
import { Grid, Typography, Box } from "@mui/material";
import AuthForm from "../Components/AuthForm";
import authSvg from "../assets/auth.svg";

function Register() {
  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      {/* Left side illustration */}
      <Grid
        size={{ xs: 12, sm: 6, md: 6, lg: 6, xl:6 }}
        sx={{
          backgroundColor: "background.default",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
        }}
      >
        <Typography variant="h3" color="primary" gutterBottom>
          FiscoTrack
        </Typography>
        <Box
          component="img"
          src={authSvg}
          alt="Welcome"
          sx={{
            maxWidth: { xs: "60%", md: "80%" },
            mt: 2,
          }}
        />
      </Grid>

      {/* Right side form */}
      <Grid
        size={{ xs: 12, sm: 6, md: 6, lg: 6, xl:6 }}
        sx={{
          backgroundColor: "#9192FF",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
          borderBottomLeftRadius: "30px",
          borderTopLeftRadius: "30px",
        }}
      >
        <AuthForm route="/api/user/register/" method="register" />
      </Grid>
    </Grid>
  );
}

export default Register;

import { Grid, Typography, Box } from "@mui/material";
import AuthForm from "../Components/AuthForm";
import authSvg from "../assets/auth.png";

function Login() {
  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      {/* Left side illustration */}
      <Grid
        size={{ xs: 12, sm: 6, md: 6, lg: 6, xl:6 }}
        sx={{
          backgroundColor: "background.secondary",
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
          backgroundColor: "primary.main",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
          borderBottomLeftRadius: "30px",
          borderTopLeftRadius: "30px",
        }}
      >
        <AuthForm route="/api/token/" method="login" />
      </Grid>
    </Grid>
  );
}

export default Login;

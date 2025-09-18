import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import ProtectedRoute from "./Components/Global_Layout/ProtectedRoute";
import Layout from "./Components/Global_Layout/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Expenses from "./pages/Expenses";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./styles/theme";

function AppContent() {
  const location = useLocation();

  function Logout() {
    localStorage.clear();
    return <Navigate to="/login" />;
  }

  function RegisterAndLogout() {
    localStorage.clear();
    return <Register />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/register" element={<RegisterAndLogout />} />

      {/* Protected routes (with "internal" Layout) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/expenses"
        element={
          <ProtectedRoute>
            <Layout>
              <Expenses />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AppContent />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import ProtectedRoute from "./Components/Global_Layout/ProtectedRoute";
import Layout from "./Components/Global_Layout/Layout";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Expenses from "./pages/Expenses";
import Receipts from "./pages/Receipts";
import Invoices from "./pages/Invoices";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";

import ExpenseView from "./pages/ExpenseView"
import InvoiceView from "./pages/InvoiceView";

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
      <Route
        path="/expenses/view/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <ExpenseView />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/invoices"
        element={
          <ProtectedRoute>
            <Layout>
              <Invoices />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/invoices/view/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <InvoiceView />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/receipts"
        element={
          <ProtectedRoute>
            <Layout>
              <Receipts />
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
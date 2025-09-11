import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./Components/NavBar";
import ProtectedRoute from "./Components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Expenses from "./pages/Expenses";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register"
function AppContent() {
  const location = useLocation();

  function Logout() {
    localStorage.clear();
    return <Navigate to='/login' />
  }

  function RegisterAndLogout() {
    localStorage.clear();
    return <Register />
  }

  // Paths where NavBar should not appear
  const hideNavPaths = ["/login", "/logout", "/register"];

  return (
    <>
      {!hideNavPaths.includes(location.pathname) && <NavBar />}

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

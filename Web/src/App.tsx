import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// CSS
import "./App.css";
// Stores
import { useAuthStore } from "./store/authStore";
// Pages
import DashBoard from "./pages/DashBoard";
import { LoginPage } from "./pages/LoginPage";
import Patients from "./pages/Patients";
// Components
import NavBar from "./components/NavBar";

function App() {
  const { getIsAuthenticated } = useAuthStore();

  // Check authentication status from store
  const isAuthenticated = getIsAuthenticated();

  return (
    <BrowserRouter>
      {/* Render NavBar only if the user is authenticated */}
      {isAuthenticated && <NavBar />}

      {/* Main Layout Wrapper:
        Added 'pt-16' (padding-top: 4rem) to match the fixed Navbar height.
        This prevents content from being hidden behind the header.
      */}
      <main className={isAuthenticated ? "pt-16 bg-gray-50 min-h-screen" : ""}>
        <Routes>
          {/* 1. Root Path Redirect */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* 2. Login Page */}
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />
            }
          />

          {/* 3. Protected Dashboard */}
          <Route
            path="/dashboard"
            element={isAuthenticated ? <DashBoard /> : <Navigate to="/login" />}
          />

          {/* 4. Placeholder Routes (redirecting to Dashboard for now) */}
          <Route
            path="/appointments"
            element={isAuthenticated ? <DashBoard /> : <Navigate to="/login" />}
          />
          <Route
            path="/patients"
            element={isAuthenticated ? <Patients /> : <Navigate to="/login" />}
          />
          <Route
            path="/treatments"
            element={isAuthenticated ? <DashBoard /> : <Navigate to="/login" />}
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;

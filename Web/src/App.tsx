import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
//css
import "./App.css";
//stores
import { useAuthStore } from "./store/authStore";
//pages
import DashBoard from "./pages/DashBoard";
import { LoginPage } from "./pages/LoginPage";
import PatientsPage from "./pages/Patients";

function App() {
  const { getIsAuthenticated } = useAuthStore();
  const isAuthenticated = getIsAuthenticated();
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. The Root Path: Decide where to go */}
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

        {/* 2. The Login Page */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />
          }
        />

        {/* 3. The Protected Dashboard */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <DashBoard /> : <Navigate to="/login" />}
        />

        <Route
          path="/patients"
          element={
            isAuthenticated ? <PatientsPage /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

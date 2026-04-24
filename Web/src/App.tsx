import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// CSS
import "./App.css";
// Stores
import { useAuthStore } from "./store/authStore";
//socket
import io from "socket.io-client";
//hooks
import { useQueryClient } from "@tanstack/react-query";
// Pages
import DashBoard from "./pages/DashBoard";
import { LoginPage } from "./pages/LoginPage";
import Patients from "./pages/Patients";
import Treatments from "./pages/Treatments";
import AppointmentsPage from "./pages/Appointments";
// Components
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Chat from "./components/Chat";
//types
import { ClinicRoleEnum } from "./types/auth";
import Documents from "./pages/Documents";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

// Initialize Socket.io client with autoConnect disabled
const socket = io(SERVER_URL, {
  withCredentials: true,
  autoConnect: false,
});

function App() {
  const { isAuthenticated, accessToken } = useAuthStore();
  const userRole = useAuthStore((state) => state.user?.user_metadata.role);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      // Set the token for authentication
      socket.auth = { token: accessToken };
      socket.connect();

      const handleCacheInvalidation = (data: { type: string }) => {
        const type = data?.type || "appointments";
        console.log(`Cache invalidation received for: ${type}`);
        queryClient.invalidateQueries({ queryKey: [type] });
      };

      socket.on("cacheInvalidation", handleCacheInvalidation);

      return () => {
        socket.off("cacheInvalidation", handleCacheInvalidation);
        socket.disconnect();
      };
    }
  }, [isAuthenticated, accessToken, queryClient]);

  return (

    <BrowserRouter>
      {/* Render NavBar only if the user is authenticated */}
      {isAuthenticated && <NavBar />}
      {isAuthenticated && userRole === ClinicRoleEnum.doctor && <Chat />}

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
            element={
              isAuthenticated ? <AppointmentsPage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/patients"
            element={isAuthenticated ? <Patients /> : <Navigate to="/login" />}
          />
          <Route
            path="/treatments"
            element={
              isAuthenticated ? <Treatments /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/documents"
            element={isAuthenticated ? <Documents /> : <Navigate to="/login" />}
          />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}

export default App;

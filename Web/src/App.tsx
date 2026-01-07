import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import { getIsAuthenticated } from "./utils/auth";

// Placeholder components
const Dashboard = () => (
  <div className="p-8 text-indigo-900">
    <h1>Dashboard Content</h1>
  </div>
);
const Appointments = () => (
  <div className="p-8 text-indigo-900">
    <h1>Appointments Content</h1>
  </div>
);
const Patients = () => (
  <div className="p-8 text-indigo-900">
    <h1>Patients List (Coming Soon)</h1>
  </div>
);

const App = () => {
  const isAuthenticated = getIsAuthenticated();

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {isAuthenticated && <NavBar />}

        <main className={`flex-grow ${isAuthenticated ? "pt-16" : ""}`}>
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/appointments"
              element={
                isAuthenticated ? <Appointments /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/patients"
              element={
                isAuthenticated ? <Patients /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/treatments"
              element={
                isAuthenticated ? (
                  <div>Treatments Page</div>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </main>

        {/* Footer is displayed only when authenticated */}
        {isAuthenticated && <Footer />}
      </div>
    </Router>
  );
};

export default App;

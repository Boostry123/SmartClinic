import { useState } from "react";
import {
  Home,
  Calendar,
  Users,
  Activity,
  Sparkles,
  Bell,
  Search,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const NavBar = () => {
  const [active, setActive] = useState("Home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", icon: <Home size={18} />, path: "/" },
    {
      name: "Appointments",
      icon: <Calendar size={18} />,
      path: "/appointments",
    },
    { name: "Patients", icon: <Users size={18} />, path: "/patients" },
    { name: "Treatments", icon: <Activity size={18} />, path: "/treatments" },
  ];
  const handleLogout = () => {
    console.log("invoking logout");
    useAuthStore.getState().clearAuth();
  };

  return (
    <>
      {/* Main Header 
        - Fixed top, full width
        - Royal AI Theme (Indigo/Slate Gradient)
      */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 shadow-2xl shadow-indigo-900/20 border-b border-white/5">
        <nav className="flex items-center justify-between w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
          {/* Logo Section */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <div className="relative flex items-center justify-center w-9 h-9 bg-indigo-500/20 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.3)] group-hover:bg-indigo-500/30 transition-all duration-300 border border-indigo-500/20">
              <Sparkles size={18} className="text-cyan-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-white tracking-tight">
                SmartClinic
              </span>
              <span className="text-[9px] font-bold text-indigo-300 tracking-[0.15em] opacity-80 uppercase">
                AI SYSTEM
              </span>
            </div>
          </div>

          {/* Desktop Navigation - Capsule Style */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = active === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActive(item.name);
                    navigate(item.path);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border border-transparent
                    ${
                      isActive
                        ? "bg-white/10 text-cyan-300 border-white/10 shadow-[0_0_15px_rgba(34,211,238,0.15)] backdrop-blur-sm transform scale-105"
                        : "text-indigo-300 hover:text-white hover:bg-white/5"
                    }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <button
              className="hidden sm:flex p-2.5 text-indigo-300 hover:text-white hover:bg-white/5 rounded-full transition-colors"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {/* Notification Bell (No red dot by default) */}
            <button
              className="hidden sm:flex p-2.5 text-indigo-300 hover:text-white hover:bg-white/5 rounded-full transition-colors relative"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {/* Uncomment the line below to show the red dot when there are notifications */}
              {/* <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-indigo-950 shadow-lg shadow-rose-500/50"></span> */}
            </button>

            <div className="hidden sm:block w-px h-6 bg-indigo-800 mx-1"></div>

            <button
              onClick={() => {
                handleLogout();
              }}
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-full transition-colors text-xs font-bold border border-rose-500/10"
            >
              <LogOut size={14} />
              <span>Exit</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-indigo-200 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="fixed top-16 left-0 right-0 z-40 md:hidden bg-slate-900/95 backdrop-blur-xl border-b border-indigo-500/20 shadow-xl animate-in slide-in-from-top-2">
          <div className="flex flex-col p-4 space-y-2 text-white">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setActive(item.name);
                  setIsMobileMenuOpen(false);
                  navigate(item.path);
                }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all
                 ${
                   active === item.name
                     ? "bg-indigo-500/20 text-cyan-300 font-medium border border-indigo-500/30"
                     : "text-indigo-300 hover:bg-white/5 hover:text-white"
                 }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            ))}
            <div className="h-px bg-indigo-500/30 my-2"></div>
            <button
              onClick={() => {
                handleLogout();
              }}
              className="flex items-center gap-3 p-3 text-rose-400 hover:bg-rose-500/10 rounded-xl w-full font-medium"
            >
              <LogOut size={18} />
              <span>Exit System</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;

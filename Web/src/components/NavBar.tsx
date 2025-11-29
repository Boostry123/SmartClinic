import { useState } from "react";
import Icons from "../assets/icons";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "#", icon: <Icons.Home /> },
    { name: "Analytics", path: "#", icon: <Icons.Analytics /> },
    { name: "Settings", path: "#", icon: <Icons.Settings /> },
  ];
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <img
              src="Logo.png"
              alt="logo"
              width={80}
              height={80}
              className="rounded shadow-sm object-contain"
            />

            <span className="text-2xl font-bold  text-slate-600 hidden sm:block">
              SmartClinic
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                className="group flex items-center gap-2.5 px-5 py-2.5 rounded-lg text-base font-medium text-slate-600 transition-all duration-200 hover:bg-slate-50 hover:text-blue-600 active:scale-95"
              >
                <span className="text-slate-400 transition-colors group-hover:text-blue-600">
                  {item.icon}
                </span>
                {item.name}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-blue-600 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out ${
          isMobileMenuOpen ? "max-h-64 border-t border-slate-100" : "max-h-0"
        }`}
      >
        <div className="space-y-2 p-4 bg-white">
          {navItems.map((item) => (
            <button
              key={item.name}
              className="flex w-full items-center gap-4 rounded-xl px-5 py-4 text-left text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600"
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

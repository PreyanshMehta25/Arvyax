import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { LogOut, User, LogIn, UserPlus, Menu, X, Settings } from "lucide-react";
import toast from "react-hot-toast";

interface DecodedToken {
  email: string;
  name: string;
}

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken: DecodedToken = jwtDecode(token);
        setUserName(decodedToken.name);
        setIsLoggedIn(true);
      } catch {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUserName(null);
      }
    } else {
      setIsLoggedIn(false);
      setUserName(null);
    }
    setIsMenuOpen(false);
  }, [location]);

  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserName(null);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <NavLink
            to="/dashboard"
            className="flex-shrink-0 flex items-center space-x-2"
          >
            <span className="text-2xl">🧘</span>
            <span className="font-bold text-xl text-gray-800">
              Arvyax Wellness
            </span>
          </NavLink>

          <div className="hidden md:flex items-center space-x-2">
            <NavLink
              to="/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/dashboard")
                  ? "text-emerald-700 bg-emerald-100"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Dashboard
            </NavLink>
            {isLoggedIn && (
              <NavLink
                to="/my-sessions"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/my-sessions")
                    ? "text-emerald-700 bg-emerald-100"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                My Sessions
              </NavLink>
            )}
          </div>

          <div className="hidden md:flex items-center">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <NavLink
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600"
                >
                  <Settings className="w-5 h-5" />
                  <span className="text-sm font-medium">{userName}</span>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <NavLink
                  to="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700"
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink
              to="/dashboard"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/dashboard")
                  ? "text-emerald-700 bg-emerald-100"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Dashboard
            </NavLink>
            {isLoggedIn && (
              <NavLink
                to="/my-sessions"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/my-sessions")
                    ? "text-emerald-700 bg-emerald-100"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                My Sessions
              </NavLink>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isLoggedIn ? (
              <div className="px-5 flex flex-col space-y-3">
                <NavLink to="/profile" className="flex items-center">
                  <Settings className="w-5 h-5 text-gray-500" />
                  <span className="ml-3 text-base font-medium text-gray-700">
                    {userName}
                  </span>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="px-2 space-y-1">
                <NavLink
                  to="/login"
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100"
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

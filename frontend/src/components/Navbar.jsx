import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiFeather,
  FiGrid,
  FiLogOut,
  FiLogIn,
  FiUserPlus,
} from "react-icons/fi";
import { getUser, logout } from "../api.js";

function Navbar() {
  const user = getUser();
  const location = useLocation();

  // Logout Function
  function handleLogout() {
    logout();
    window.location.href = "/";
  }

  return (
    <motion.nav
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 bg-[#FBFBFD]/80 backdrop-blur-xl border-b border-zinc-200/70"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="group inline-flex items-center gap-2.5 text-zinc-950 font-bold text-lg tracking-tight"
        >
          <span className="w-9 h-9 rounded-xl bg-zinc-950 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <FiFeather size={17} />
          </span>
          <span>
            My<span className="text-blue-600">Blog</span>
          </span>
        </Link>

        {/* Right Navigation Items */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              {/* User Greeting Pill */}
              <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-zinc-200/80 text-xs font-medium text-zinc-700 shadow-2xs">
                <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white text-[10px] font-bold flex items-center justify-center uppercase">
                  {user.name?.charAt(0) || "U"}
                </span>
                <span>Hi, {user.name}</span>
              </div>

              {/* Admin Dashboard Link */}
              {user.role === "admin" && (
                <Link
                  to="/dashboard"
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                    location.pathname === "/dashboard"
                      ? "bg-zinc-950 text-white shadow-xs"
                      : "bg-zinc-100 hover:bg-zinc-200/80 text-zinc-800"
                  }`}
                >
                  <FiGrid size={14} />
                  <span>Dashboard</span>
                </Link>
              )}

              {/* Logout Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-medium bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 transition-colors cursor-pointer"
              >
                <FiLogOut size={14} />
                <span>Logout</span>
              </motion.button>
            </>
          ) : (
            <>
              {/* Login Link */}
              <Link
                to="/login"
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                  location.pathname === "/login"
                    ? "text-blue-600 bg-blue-50/70"
                    : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80"
                }`}
              >
                <FiLogIn size={14} />
                <span>Login</span>
              </Link>

              {/* Register Primary Pill Button */}
              <motion.div whileTap={{ scale: 0.96 }}>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-medium bg-zinc-950 hover:bg-zinc-800 text-white shadow-xs transition-all"
                >
                  <FiUserPlus size={14} />
                  <span>Register</span>
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;

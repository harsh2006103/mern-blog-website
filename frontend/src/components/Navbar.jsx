
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const [user, setUser] = useState(getUser());
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const updateUser = () => setUser(getUser());

    window.addEventListener("authChanged", updateUser);

    return () => {
      window.removeEventListener("authChanged", updateUser);
    };
  }, []);

  function handleLogout() {
    logout();
    window.dispatchEvent(new Event("authChanged"));
    navigate("/", { replace: true });
  }

  return (
    <motion.nav
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 bg-[#FBFBFD]/80 backdrop-blur-xl border-b border-zinc-200/70"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="group inline-flex items-center gap-2.5 text-zinc-950 font-bold text-lg tracking-tight"
        >
          <span className="w-9 h-9 rounded-xl bg-zinc-950 text-white flex items-center justify-center shadow-xs">
            <FiFeather size={17} />
          </span>
          <span>
            My<span className="text-blue-600">Blog</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-zinc-200/80 text-xs font-medium text-zinc-700">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center uppercase">
                  {user.name?.charAt(0) || "U"}
                </span>
                <span>Hi, {user.name}</span>
              </div>

              {user.role === "admin" && (
                <Link
                  to="/dashboard"
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-medium ${
                    location.pathname === "/dashboard"
                      ? "bg-zinc-950 text-white"
                      : "bg-zinc-100 text-zinc-800"
                  }`}
                >
                  <FiGrid size={14} />
                  Dashboard
                </Link>
              )}

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-medium bg-rose-50 text-rose-600 border border-rose-200/60 cursor-pointer"
              >
                <FiLogOut size={14} />
                Logout
              </motion.button>
            </>
          ) : (
            <>
              <Link to="/login">
                <FiLogIn size={14} className="inline mr-1" />
                Login
              </Link>

              <motion.div whileTap={{ scale: 0.96 }}>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-medium bg-zinc-950 text-white"
                >
                  <FiUserPlus size={14} />
                  Register
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

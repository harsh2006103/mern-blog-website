import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "../src/pages/Home.jsx";
import Login from "../src/pages/Login.jsx";
import Register from "../src/pages/Register.jsx";
import Dashboard from "../src/pages/Dashboard.jsx";
import BlogPage from "../src/pages/BlogPage.jsx";
import { getUser } from "./api.js";

export default function App() {
  const user = getUser();

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog/:id" element={<BlogPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              user?.role === "admin" ? <Dashboard /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </div>
    </>
  );
}

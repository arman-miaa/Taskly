import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { AuthContext } from "../providers/AuthProvider";
import logo from "/Taskly-logo.webp";
import { FaBars, FaTimes } from "react-icons/fa"; // Importing hamburger and close icons

const Navbar = () => {
  const { user, logOutUser, loading } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false); // State to toggle the sidebar
  const navigate = useNavigate();

  if (!loading && !user) {
    navigate("/login");
  }

  // Logout Function
  const handleLogout = async () => {
    try {
      await logOutUser();
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <nav className="bg-gray-300 shadow-md py-3 px-6 flex justify-between items-center">
      {/* Left Side - Branding and Hamburger */}
      <div className="flex items-center gap-2">
        {/* Hamburger Menu Icon */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <FaTimes className="text-xl text-primary" />
            ) : (
              <FaBars className="text-xl text-primary" />
            )}
          </button>
        </div>

        {/* Logo */}
        <div className="text-2xl font-bold text-primary">
          <NavLink to="/" className="flex items-center gap-1">
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={logo}
              alt="Taskly Logo"
            />
            <h3>Taskly</h3>
          </NavLink>
        </div>
      </div>

      {/* Center - Navigation Links (Desktop Menu) */}
      <div className="hidden md:flex gap-6 text-lg font-medium">
        <NavLink to="/" className="hover:text-primary">
          Home
        </NavLink>
        <NavLink to="/tasks" className="hover:text-primary">
          Tasks
        </NavLink>
        <NavLink to="/about" className="hover:text-primary">
          About
        </NavLink>
      </div>

      {/* Right Side - User Profile / Login */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <img
              src={user.photoURL || "https://via.placeholder.com/40"} // User Photo
              alt="User"
              className="w-10 h-10 rounded-full border"
            />
            <button
              onClick={handleLogout}
              className="btn btn-sm btn-outline text-red-500"
            >
              Logout
            </button>
          </div>
        ) : (
          <NavLink to="/login" className="btn btn-primary btn-sm">
            Login
          </NavLink>
        )}
      </div>

      {/* Sidebar for Mobile */}
      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } fixed top-0 left-0 w-64 bg-gray-300 h-full transition-transform ease-in-out duration-300 md:hidden`}
      >
        <div className="flex justify-between items-center p-4">
          <div className="text-2xl font-bold text-primary">
            <NavLink to="/" className="flex items-center gap-1">
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={logo}
                alt="Taskly Logo"
              />
              <h3>Taskly</h3>
            </NavLink>
          </div>
          <button onClick={() => setIsOpen(false)}>
            <FaTimes className="text-xl text-primary" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-4 py-4">
          <NavLink
            to="/"
            className="hover:text-primary"
            onClick={() => setIsOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/tasks"
            className="hover:text-primary"
            onClick={() => setIsOpen(false)}
          >
            Tasks
          </NavLink>
          <NavLink
            to="/about"
            className="hover:text-primary"
            onClick={() => setIsOpen(false)}
          >
            About
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

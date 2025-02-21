import { useContext } from "react";
import { NavLink, useNavigate } from "react-router";
import { AuthContext } from "../providers/AuthProvider";
import logo from "/Taskly-logo.webp";


const Navbar = () => {
  const { user, logOutUser, loading } = useContext(AuthContext);

  const navigate = useNavigate();

  if (!loading && !user) {
    navigate("/login")
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
      {/* Left Side - Branding */}
      <div className="text-2xl font-bold text-primary">
        <NavLink to="/" className='flex items-center gap-1'>
          {" "}
          <img
            className="w-8 h-8 rounded-full object-cover"
            src={logo}
            alt=""
          />{" "}
          <h3>Taskly</h3>
        </NavLink>
      </div>

      {/* Center - Navigation Links */}
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
            {/* <span className="text-gray-700 font-medium">{user.email}</span> */}
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
    </nav>
  );
};

export default Navbar;

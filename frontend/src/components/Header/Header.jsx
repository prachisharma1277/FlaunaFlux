import { useState, useEffect } from "react";
import { Link, useNavigate,NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";
import logo from "../../assets/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
   const token = localStorage.getItem("token");
   const userString = localStorage.getItem("user"); // Get the string
    
    let role = null; // Default to null

    // Safely parse the user string
    if (userString) {
      try {
        const userObject = JSON.parse(userString); // Parse the string into an object
        role = userObject.role; // Get the role from the object
      } catch (e) {
        console.error("Failed to parse user from localStorage:", e);
      }
    }
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false); // Explicitly set to false if no token
    }
    
    if (role) {
      setUserRole(role);
    } else {
      setUserRole(null);
    }
  }, []);

  const handleLogout = () => {
    // Clear all auth-related items from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    // Reset component state
    setIsLoggedIn(false);
    setUserRole(null);
    setIsOpen(false); // Close mobile menu if open

    // Navigate to the home page
    navigate("/");
  };

  const handleProfile = () => {
    if (userRole==="authorised"){
    navigate("/profile");
    }
    else{
    navigate("/profilen");
    }
  };

  const isActive = (path) => location.pathname === path;
  

  // Helper function to determine the correct home path
 
  
  const getPopulationPath = () => {
    if (isLoggedIn && userRole === "authorised") {
      return "/population-n";
    }
    return "/population-n";
  };

 

  const getClimatePath = () => {
    if (isLoggedIn && userRole === "authorised") {
      return "/climate";
    }
    return "/climaten";
  };

  const navLinks = [
    ["Home", "/"],
    ["Population Metrics", getPopulationPath()],
    ["Community", "/community"],
    ["Climate Impact",getClimatePath()],
    ["About Us", "/about"],
  ];

  // *** NEW: Conditionally add Dashboard link for authorised users ***
  if (isLoggedIn && userRole === "authorised") {
    // .splice(index, deleteCount, item)
    // This inserts ["Dashboard", "/dashboard"] at index 1 (after "Home")
    navLinks.splice(1, 0, ["Dashboard", "/home"]);
  }
  if (isLoggedIn && userRole === "authorised") {
    navLinks.splice(3, 0, ["Report", "/record"]);
  }
  // Style functions for NavLink
  const desktopLinkClass = ({ isActive }) =>
    `transition-colors duration-200 ${
      isActive ? "text-green-700 font-semibold" : "hover:text-green-700"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `transition-colors duration-200 ${
      isActive ? "text-green-200 font-semibold" : "hover:text-green-200"
    }`;
  
  // Button style for mobile logout
  const mobileButtonClass = "bg-white text-green-800 font-medium px-4 py-1.5 rounded-md border border-transparent hover:bg-transparent hover:text-white hover:border-white transition-all duration-200 w-full text-center";

  return (
    <motion.nav
      className="w-screen bg-white text-black shadow-md fixed top-0 left-0 z-2000"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo + Title */}
        <div className="flex items-center space-x-2">
          <img src={logo} alt="FaunaFlux Logo" className="h-9 w-8 rounded-full" />
          <h1 className="text-lg font-semibold tracking-wide">
            <span className="text-black">Fauna</span>
            <span className="text-green-800">Flux</span>
          </h1>
        </div>

        <div className="hidden md:flex items-center space-x-6 text-sm">
          {navLinks.map(([name, path]) => (
            <NavLink
              key={name}
              to={path}
              className={desktopLinkClass}
              end // Use 'end' for 'Home' to only match exactly
            >
              {name}
            </NavLink>
          ))}
        </div>

        {/* Right Section */}
        <div className="hidden md:block relative">
          {isLoggedIn ? (
            <div
              className="cursor-pointer flex items-center space-x-1 text-green-800"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <FaUserCircle size={28} />
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-green-700 text-white font-medium px-4 py-1.5 rounded-md hover:bg-transparent hover:text-green-800 hover:border-green-800 border transition-all duration-200"
            >
              Log In
            </Link>
          )}

          {/* Dropdown Menu (only when logged in) */}
          {showDropdown && isLoggedIn && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-lg rounded-md">
              <button
                onClick={handleProfile}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-green-50"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex flex-col justify-center items-center space-y-[4px]"
        >
          <span
            className={`block h-[2px] w-6 bg-black transition-all ${
              isOpen ? "rotate-45 translate-y-[6px]" : ""
            }`}
          ></span>
          <span
            className={`block h-[2px] w-6 bg-black transition-all ${
              isOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block h-[2px] w-6 bg-black transition-all ${
              isOpen ? "-rotate-45 -translate-y-[6px]" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-green-900 text-white flex flex-col items-center space-y-4 py-4 border-t border-green-700"
        >
          {[
            ["Home", "/"],
            ["Population Matrix", "/population"],
            ["Community", "/community"],
            ["Alert Page", "/alerts"],
            ["Climate Impact", "/climate"],
            ["About Us", "/about"],
          ].map(([name, path]) => (
            <Link
              key={name}
              to={path}
              onClick={() => setIsOpen(false)}
              className={`transition-colors duration-200 ${
                isActive(path)
                  ? "bg-green-700 px-3 py-1.5 rounded-md font-semibold"
                  : "hover:text-green-200"
              }`}
            >
              {name}
            </Link>
          ))}

          {/* Buttons Based on Login Status */}
          {isLoggedIn ? (
            <>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleProfile();
                }}
                className="bg-white text-green-800 px-4 py-1.5 rounded-md font-medium hover:bg-transparent hover:text-white hover:border-white border transition-all duration-200"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="bg-red-600 text-white px-4 py-1.5 rounded-md font-medium hover:bg-transparent hover:text-red-400 hover:border-red-400 border transition-all duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-white text-green-800 font-medium px-4 py-1.5 rounded-md border hover:bg-transparent hover:text-white hover:border-white transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              Log In
            </Link>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
}

import React, { useState, useEffect, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { Context } from "../context/Context";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = ({ mobileOpen = false, onClose = () => {} }) => {
  const { navigate, backendUrl, setUserData, userData, setIsLoggedin} =
    useContext(Context);

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl +  "/api/auth/logout");
      if (data.success) {
        setIsLoggedin(false);
        setUserData(false);
        toast.success("Logged out successfully");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message || "Logout failed");
    }
  };

  const handleNavClick = () => {
    if (window.innerWidth < 768) onClose();
  };

  // Advanced responsive classes with smooth transitions
  const sidebarClasses = [
    "fixed md:static inset-0 md:top-0 md:left-0 z-[3000]",
    "flex flex-col",
    "bg-gradient-to-b from-gray-100 to-gray-200",
    "dark:from-gray-900 dark:to-gray-800",
    "w-64 md:w-52 lg:w-64 h-screen overflow-hidden",
    "transition-all duration-300 ease-in-out",
    mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
  ].join(" ");

  // Create consistent nav item styling for reuse
  const navItemBase = "flex items-center gap-3 px-6 py-3 transition duration-200 rounded-lg mx-3";
  const navItemActive = `${navItemBase} bg-gray-800 text-white font-medium shadow-sm dark:bg-gray-700 dark:text-white`;
  const navItemInactive = `${navItemBase} hover:bg-gray-300/70 text-gray-700 dark:hover:bg-gray-700/60 dark:text-gray-200`;

  return (
    <>
      {/* Overlay that only appears on mobile when menu is open */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 dark:bg-white/10 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}
    
      <aside className={sidebarClasses}>
        <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
        {/* Close button with improved styling */}
        <button
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 p-2 rounded-full hover:bg-gray-300 bg-white/80 text-gray-700
          dark:hover:bg-gray-700 dark:bg-gray-800/80 dark:text-gray-200"
          aria-label="Close menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Logo with enhanced styling */}
        <Link 
          to="/dashboard" 
          onClick={handleNavClick}
          className="mt-8 mb-6 flex justify-center items-end space-x-1
          focus:outline-none focus-visible:outline-none"
        >
          <span className="font-bold text-4xl md:text-4xl lg:text-5xl text-gray-900 dark:text-white">
            GEO
          </span>
          <span className="font-semibold text-2xl md:text-xl lg:text-2xl text-gray-700 dark:text-gray-300">
            nex
          </span>
        </Link>

        {/* Subtle divider */}
        <div className="w-3/4 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto mb-6 dark:via-gray-600" />

        {/* Navigation links with indicators and hover effects */}
        <nav className="flex flex-col gap-2 mt-2">
          {[
            { to: "/dashboard", icon: assets.home, label: "Home" },
            { to: "/devices", icon: assets.devices, label: "Devices" },
            { to: "/projects", icon: assets.projects, label: "Projects" },
            { to: "/settings", icon: assets.settings, label: "Settings" },
          ].map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={handleNavClick}
              className={({ isActive }) => isActive ? navItemActive : navItemInactive}
            >
              <div className="bg-white/80 p-2 rounded-lg shadow-sm dark:bg-gray-80">
                <img src={icon} alt="" className="w-5 h-5" />
              </div>
              <span className="text-lg font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Empty space that grows to push logout button to bottom */}
        <div className="flex-grow" />

        {/* User profile hint (optional) */}
        <div className="px-6 py-4 mx-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center 
            justify-center text-white font-bold dark:bg-gray-700">
              {userData ? userData.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-grow">
              <p className="text-sm text-gray-500 dark:text-gray-400">Logged in</p>
            </div>
          </div>
        </div>

        {/* Improved logout button */}
        <button 
          onClick={logout} 
          className="mx-4 mb-6 px-6 py-3 rounded-lg border border-red-500 text-red-500 font-medium
                    hover:bg-red-500 hover:text-white transition-colors duration-200 flex items-center justify-center gap-2
                    dark:border-red-400 dark:text-red-400
                    dark:hover:bg-red-700 dark:hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Log out
        </button>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
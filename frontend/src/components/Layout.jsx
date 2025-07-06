import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { assets } from "../assets/assets";

/* A wrapper that owns the “sidebar-open” state */
export default function Layout() {
  const [open, setOpen] = useState(false);

  /* lock / unlock page scroll when drawer is open */
  useEffect(() => {
    if (open) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // clean-up on unmount
    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);

  return (
    <div className="flex min-h-screen bg-[#e8e8e8] dark:bg-gray-900">
      {/* ❋ backdrop shown only while the sidebar is open on phones */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 md:hidden z-40"
        />
      )}
      {/* ───── sidebar ───── */}
      <Navbar mobileOpen={open} onClose={() => setOpen(false)} />

      {/* ───── page area ───── */}
      <div id="scroll-area" 
      className="flex-1 relative h-screen overflow-y-auto
      bg-[#e8e8e8] dark:bg-gray-900">
        {/* mobile hamburger */}
        <button
          onClick={() => setOpen(true)}
          className="md:hidden p-3 m-2 rounded 
          hover:bg-gray-200 focus:outline-none focus:ring
          fixed left-0 top-0 
          dark:bg-gray-700"
        >
          {/* burger icon */}
          <img className="w-5 h-5" src={assets.hamburger_icon} />
        </button>

        {/* routed pages */}
        <div className="w-full max-w-7xl mx-auto px-5 py-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

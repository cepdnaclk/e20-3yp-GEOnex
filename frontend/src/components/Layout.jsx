import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { Outlet, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";

/* A wrapper that owns the “sidebar-open” state */
export default function Layout() {
  const [open, setOpen] = useState(false);

  /* ─── Jump to top whenever the route changes ───────────── */
  const { pathname } = useLocation();
  useEffect(() => {
    const scroller = document.getElementById("scroll-area");
    if (scroller) {
      // modern - smooth-less jump
      scroller.scrollTo({ top: 0, left: 0, behavior: "instant" });
      // fallback (old Safari / iOS)
      scroller.scrollTop = 0;
    }
  }, [pathname]);

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

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("openSidebar", handler);
    return () => window.removeEventListener("openSidebar", handler);
  }, []);

  return (
    <div
      className="flex min-h-screen 
    w-full overflow-x-hidden
    bg-[#e8e8e8] dark:bg-gray-900"
    >
      {/* ❋ backdrop shown only while the sidebar is open on phones */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 md:hidden z-[2900]"
        />
      )}
      {/* ───── sidebar ───── */}
      <Navbar mobileOpen={open} onClose={() => setOpen(false)} />

      {/* ───── page area ───── */}
      <div
        id="scroll-area"
        className="flex-1 relative h-screen 
        overflow-y-auto overflow-x-hidden  
      bg-[#e8e8e8] dark:bg-gray-900"
      >
        {/* mobile hamburger */}
        {/* <button
          onClick={() => setOpen(true)}
          className="md:hidden p-3 m-2 rounded 
          hover:bg-gray-200 focus:outline-none focus:ring
          fixed left-0 top-[-0.30rem] z-30
          dark:bg-gray-700"
        >
        
          <img className="w-6 h-6" src={assets.hamburger_icon} />
        </button> */}

        {/* routed pages */}
        <div className="w-full max-w-7xl mx-auto px-5 pt-2 md:pt-4 pb-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

/**
 * Re-usable page header for top-level sections.
 *
 * Props
 * ─────
 *  title   : string                – big text
 *  subtitle: string (optional)     – smaller text under the title
 *  right   : ReactNode (optional)  – anything you want on the far right
 */
export default function SectionHeader({ title, subtitle, right = null }) {
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const scroller = document.getElementById("scroll-area"); // ← new

    const handle = () => {
      setScrolled(scroller.scrollTop > 10); // use its own scrollTop
    };

    scroller.addEventListener("scroll", handle, { passive: true });
    return () => scroller.removeEventListener("scroll", handle);
  }, []);

  return (
    <div
      className={`sticky top-0 z-20 flex items-center justify-between 
                  gap-3 mb-2 py-3
                  transition-colors duration-300
                  -mx-6 -my-2 px-4
                   
                  ${
                    scrolled
                      ? "bg-gray-100 dark:bg-gray-900 shadow-sm backdrop-blur"
                      : "bg-transparent"
                  }`}
    >
      <div className="flex items-center gap-3">
        {/* mobile burger – fires custom event the Layout listens for */}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-200
                       focus:outline-none focus:ring dark:bg-gray-700"
          onClick={() => window.dispatchEvent(new Event("openSidebar"))}
        >
          <img src={assets.hamburger_icon} alt="" className="w-5 h-5" />
        </button>

        {/* titles */}
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold">
            {title}
          </h1>

          {subtitle && (
            <p className="text-sm md:text-base lg:text-lg mt-0 md:mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* right block (optional) */}
      {right && <div className="flex-shrink-0">{right}</div>}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Re-usable page header for top-level sections.
 *
 * Props
 * ─────
 *  title   : string                – big text
 *  subtitle: string (optional)     – smaller text under the title
 *  right   : ReactNode (optional)  – anything you want on the far right
 */
export default function SectionHeader({ title, subtitle, right = null}) {
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
    <div className={`sticky top-0 z-20 flex items-center justify-between 
                  gap-3 mb-2 py-3
                  transition-colors duration-300
                  -mx-6 pl-16 pt-0 pr-4
                  md:px-5 
                  ${
                    scrolled
                      ? "bg-gray-100 dark:bg-gray-900 shadow-sm backdrop-blur"
                      : "bg-transparent"
                  }`}>
      
      
        
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold">
            {title}
          </h1>

          {subtitle && (
            <p className="text-sm md:text-base lg:text-lg mt-1">{subtitle}</p>
          )}
        </div>
      

      {/* right block (optional) */}
      {right && <div className="flex-shrink-0">{right}</div>}
    </div>
  );
}

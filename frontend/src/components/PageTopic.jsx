import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const PageTopic = ({ topic, intro, right = null }) => {
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
                  -mx-5 -my-2 pl-12 pt-0 pr-4
                  md:px-5 
                  ${
                    scrolled
                      ? "bg-gray-100 dark:bg-gray-900 shadow-sm backdrop-blur"
                      : "bg-transparent"
                  }`}
    >
      {/* left cluster */}
      <div className="flex items-center gap-3 mt-1">
        <button className="text-xl" onClick={() => navigate(-1)}>
          <img
            className="w-5 h-5 md:w-8 md:h-8 dark:invert dark:brightness-0"
            src={assets.arrow}
            alt="goback"
          />
        </button>

        <div>
          <h1 className="text-xl md:text-3xl lg:text-4xl font-semibold">
            {topic}
          </h1>
          <p className="text-xs md:text-base lg:text-lg mt-0 md:mt-1">{intro}</p>
        </div>
      </div>
      {/* right-hand slot */}
      {right && <div className="flex-shrink-0">{right}</div>}
    </div>
  );
};

export default PageTopic;

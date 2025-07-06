import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const PageTopic = ({ topic, intro }) => {
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
      className={`sticky top-0 z-30 flex items-center gap-3 mb-3 py-3
                  transition-colors duration-300
                  -mx-5 px-5 
                  ${
                    scrolled
                      ? "bg-gray-100 dark:bg-gray-900 shadow-sm backdrop-blur"
                      : "bg-transparent"
                  }`}
    >
      <button
        className="text-2xl"
        onClick={() => {
          navigate(-1);
        }}
      >
        <img
          className="w-6 h-6 md:w-8 md:h-8 dark:invert dark:brightness-0 "
          src={assets.arrow}
          alt="goback"
        />
      </button>

      <div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold">
          {topic}
        </h1>
        <p className="text-sm md:text-base lg:text-lg mt-1">{intro}</p>
      </div>
    </div>
  );
};

export default PageTopic;

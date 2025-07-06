import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";


const PageTopic = ({topic, intro}) => {
    const navigate = useNavigate();
    return (
        <div className="flex items-center gap-3 mb-8">
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
          <p className="text-sm md:text-base lg:text-lg mt-1">
            {intro}
          </p>
        </div>
      </div>
    );
}

export default PageTopic;
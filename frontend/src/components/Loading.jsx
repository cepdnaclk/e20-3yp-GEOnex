import React from "react";

const Loading = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: "rgba(47,47,48,1)" }}
    >
      {/* GEOnex word-mark */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl tracking-wide font-light text-white">
        <span className="font-semibold">GEO</span>nex
      </h1>

      {/* animated Loading… */}
      <p className="flex items-end gap-1 mt-1 md:mt-3 text-base sm:text-xl text-white/80">
        {/* three dots with staggered bounce */}
        <span className="animate-bounce [animation-delay:0s]">.</span>
        <span className="animate-bounce [animation-delay:.15s]">.</span>
        <span className="animate-bounce [animation-delay:.3s]">.</span>
      </p>
    </div>
  );
};

export default Loading;

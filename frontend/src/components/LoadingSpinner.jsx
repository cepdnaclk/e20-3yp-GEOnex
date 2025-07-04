import React from 'react';



const LoadingSpinner = ({ size = 5 }) => {
  return (
    <div className="flex justify-center items-center h-screen z-50">
      <div className="backdrop-blur-sm bg-white/80 p-4 rounded-full shadow-2xl flex flex-col items-center animate-fade-in-up">
      
        {/* Spinner with subtle glow */}
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full"></div>
          <div className={`relative animate-spin rounded-full h-${size} w-${size} border-4 border-t-gray-950 border-gray-300`}></div>
        </div>

      </div>
    </div>
  );
};

export default LoadingSpinner;

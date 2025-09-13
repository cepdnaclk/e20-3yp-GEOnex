import React, { useState, useContext, useEffect } from "react";
import { Context } from "../context/Context";
import { toast } from "react-toastify";

const ConfirmDiscard = ({ projectId }) => {
  const { setShowConfirmDiscard, points, deletePoint } = useContext(Context);

  const handleDiscard = async () => {
    if (points.length === 0) {
      toast.error("No recorded point to discard.");
      setShowConfirmDiscard(false);
      return;
    }
    // Get the last recorded point
    const lastPoint = points[points.length - 1];
    await deletePoint(projectId, lastPoint._id);
    setShowConfirmDiscard(false);
  };

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setShowConfirmDiscard(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setShowConfirmDiscard]);

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-[5px] z-[2000]
                 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) setShowConfirmDiscard(false);
      }}
    >
      <div
        className="bg-white p-2 mx-4 rounded-2xl shadow-lg 
      w-full md:w-[340px] h-[280px] text-center"
      >
        <h2 className="text-lg md:text-xl font-bold text-red-500">
          Confirm Action
        </h2>

        {/* Divider */}
        <div className="border-t border-black my-3"></div>

        <p className="text-gray-700 text-sm  md:text-base mt-2">
          Do you want to discard the last point data? This action cannot be
          undone.
        </p>

        {/* Displayed Point Name */}
        <div className="mt-3 font-bold text-lg md:text-xl flex items-center justify-center gap-2">
          <img src="/assets/device.png" alt="" className="w-5 h-5" />
          <span className="text-black">
            {points.length > 0 ? points[points.length - 1].Name : "No Point"}
          </span>
        </div>

        {/* Buttons */}
        <div className="mt-4 px-4 flex flex-col gap-2">
          {/* Yes, Discard */}
          <button
            className="border border-red-500 text-red-500 p-1 rounded-xl hover:bg-red-500 hover:text-white transition text-sm md:text-base"
            onClick={handleDiscard}
          >
            Yes, Discard
          </button>

          {/* No, Keep It */}
          <button
            className="border border-black p-1 rounded-xl bg-black text-white mb-2 text-sm md:text-base"
            onClick={() => setShowConfirmDiscard(false)}
          >
            No, Keep It
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDiscard;

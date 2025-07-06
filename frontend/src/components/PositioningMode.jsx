import React from "react";
import { useState, useContext } from "react";
import { Context } from "../context/Context";

const PositioningMode = () => {
  const [baseMode, setBaseMode] = useState("known");
  const [baseLatitude, setBaseLatitude] = useState("");
  const [baseLongitude, setBaseLongitude] = useState("");
  const {
    navigate,
    backendUrl,
    project,
    setProject,
    updateProjectBaseMode,
    updateProjectBaseLocations,
  } = useContext(Context);

  const handleBaseModeChange = (mode) => {
    setBaseMode(mode);
    updateProjectBaseMode(project._id, mode);
  };

  const handleBaseLocationUpdate = (latitude, longitude) => {
    if (baseMode === "known") {
      if (latitude && longitude) {
        updateProjectBaseLocations(project._id, latitude, longitude);
      } else {
        alert("Please enter valid latitude and longitude values.");
      }
    } else {
      alert("Base location cannot be updated in Auto Fix mode.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800  p-5 rounded-lg flex flex-col gap-4 h-max ">
      <h2 className="text-base md:text-lg font-semibold pb-2 border-b ">
        Positioning Mode
      </h2>

      {/* iOS-style Toggle Button */}
      <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full flex w-fit m-auto">
        <button
          onClick={() => handleBaseModeChange("known")}
          className={`px-5 py-1 rounded-full text-sm font-medium transition-all ${
            baseMode === "known"
              ? "bg-gray-950 text-white shadow dark:bg-indigo-500"
              : "text-gray-700 dark:text-gray-300"
          }`}
        >
          Known Position
        </button>
        <button
          onClick={() => handleBaseModeChange("auto")}
          className={`px-5 py-1 rounded-full text-sm font-medium transition-all ${
            baseMode === "auto"
              ? "bg-blue-600 text-white shadow dark:bg-indigo-500"
              : "text-gray-700 dark:text-gray-300"
          }`}
        >
          Auto Fix
        </button>
      </div>

      {/* ── Lat / Lng inputs ───────────────────────── */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Latitude</label>
        <input
          type="text"
          placeholder={
            project.baseLatitude ? project.baseLatitude : "Enter Latitude"
          }
          className="border border-gray-300 dark:border-gray-600 
          rounded-md px-3 py-2 text-sm
          dark:bg-gray-900 dark:text-gray-100"
          disabled={baseMode === "auto"}
          onChange={(e) => setBaseLatitude(e.target.value)}
          value={baseLatitude}
        />

        <label className="text-sm font-medium">Longitude</label>
        <input
          type="text"
          placeholder={
            project.baseLongitude ? project.baseLongitude : "Enter longitude"
          }
          className="border border-gray-300 dark:border-gray-600
          rounded-md px-3 py-2 text-sm
          dark:bg-gray-900 dark:text-gray-100"
          disabled={baseMode === "auto"}
          onChange={(e) => setBaseLongitude(e.target.value)}
          value={baseLongitude}
        />
      </div>

      <button
        onClick={() => handleBaseLocationUpdate(baseLatitude, baseLongitude)}
        className={`py-2 rounded-md font-medium transition ${
          baseMode === "auto"
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-gray-950 text-white hover:bg-blue-700  dark:hover:bg-indigo-500"
        }`}
        disabled={baseMode === "auto"}
      >
        Update Base Position
      </button>
    </div>
  );
};

export default PositioningMode;

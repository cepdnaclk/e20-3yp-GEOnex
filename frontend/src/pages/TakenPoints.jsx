import React, { useContext, useState, useEffect } from "react";
import { Context } from "../context/Context";
import { assets } from "../assets/assets";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import RenamePointPopup from "../components/RenamePointPopup";

const TakenPoints = () => {
  const {
    navigate,
    points,
    setPoints,
    fetchPoints,
    loadingPoints,
    deletePoint,
    backendUrl,
  } = useContext(Context);
  const { projectId } = useParams();

  const [showRenamePoint, setShowRenamePoint] = useState(false);
  const [pointToRename, setPointToRename] = useState(null);

  // Fetch points from context when component mounts or projectId changes
  useEffect(() => {
    if (projectId) {
      fetchPoints(projectId);
    }
  }, [projectId]);

  // Use the context's deletePoint function
  const handleDeletePoint = async (pointId) => {
    if (!window.confirm("Are you sure you want to delete this point?")) return;
    await deletePoint(projectId, pointId);
  };

  const handleRenamePoint = (pointId) => {
    const point = points.find((p) => p._id === pointId);
    setPointToRename(point);
    setShowRenamePoint(true);
  };

  const onRename = async (newName) => {
    if (!pointToRename) return;

    try {
      const response = await axios.put(
        backendUrl + `/api/points/${projectId}/${pointToRename._id}/rename`,
        { Name: newName }
      );

      if (response.data.success) {
        toast.success("Point renamed successfully");
        // Refresh points list or update local state
        const updatedPoints = points.map((p) =>
          p._id === pointToRename._id ? { ...p, Name: newName } : p
        );
        setPoints(updatedPoints);
      } else {
        toast.error("Failed to rename point");
      }
    } catch (error) {
      toast.error("Error renaming point: " + error.message);
    } finally {
      setShowRenamePoint(false);
      setPointToRename(null);
    }
  };

  const onDiscard = () => {
    setShowRenamePoint(false);
    setPointToRename(null);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:grid-rows-[80px_auto]">
        {/* Header row with left group and right button */}
        <div className="col-span-1 md:col-span-2 flex items-center justify-between">
          {/* Left group: arrow and title */}
          <div className="flex items-center gap-3">
            {/* Left arrow button */}
            <button
              className="text-2xl"
              onClick={() => {
                navigate(-1);
              }}
            >
              <img className="w-8 h-8" src={assets.arrow} alt="Go back" />
            </button>

            {/* Title & subtitle */}
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold">
                Taken Points
              </h1>
              <p className="text-sm md:text-base lg:text-lg mt-1">
                Play with points
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* refresh button */}
            <button
              className="text-2xl"
              onClick={() => window.location.reload()}
            >
              <img
                className="w-7 h-7 md:w-9 md:h-9"
                src={assets.refresh}
                alt="refresh"
              />
            </button>

            <button
              className="flex items-center gap-1 text-sm md:text-base lg:text-lg md:px-10 px-4 py-2 bg-black text-white rounded-xl"
              onClick={() => {
                navigate(`/project/${projectId}`);
              }}
            >
              Save Changes
            </button>
          </div>
        </div>

        <div className="p-4 col-span-1 md:col-span-2 ">
          {loadingPoints ? (
            <p>Loading points...</p>
          ) : (
            <div className="overflow-x-auto">
              <table
                className=" w-full text-xs md:text-base text-left border-separate border-spacing-y-2"
                style={{ borderCollapse: "separate" }}
              >
                <thead className="text-sm md:text-base text-gray-700 uppercase">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Point
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Latitude
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Longitude
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Accuracy
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Timestamp
                    </th>
                    <th scope="col" className="px-10 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {points.map((point, index) => (
                    <tr
                      key={point._id || index}
                      style={{ backgroundColor: "rgba(217,217,217,1)" }}
                    >
                      <td className="px-6 py-4 rounded-l-lg">{point.Name}</td>
                      <td className="px-6 py-4">{point.Latitude}</td>
                      <td className="px-6 py-4">{point.Longitude}</td>

                      <td className="px-8 py-4">N/A</td>
                      <td className="px-6 py-4">
                        {new Date(point.Timestamp).toLocaleString()}
                      </td>

                      <td className="px-6 py-4 rounded-r-lg">
                        <div className="flex flex-col md:flex-row gap-2 w-full">
                          <button
                            className="flex-1 text-white text-xs md:text-sm 
                        bg-black hover:text-blue-700 
                        px-2 py-1 rounded-lg"
                            onClick={() => handleRenamePoint(point._id)}
                          >
                            Rename
                          </button>

                          <button
                            className="flex-1 text-white text-xs md:text-sm 
                          bg-red-500 hover:text-red-700 
                          px-2 py-1 rounded-lg"
                            onClick={() => handleDeletePoint(point._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showRenamePoint && pointToRename && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[5px] z-[2000]">
          <RenamePointPopup
            existingName={pointToRename.Name}
            onRename={onRename}
            onDiscard={onDiscard}
          />
        </div>
      )}
    </div>
  );
};

export default TakenPoints;

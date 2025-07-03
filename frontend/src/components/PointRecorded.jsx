import React, { useState, useContext, useEffect } from "react";
import { Context } from "../context/Context";
import axios from "axios";
import { toast } from "react-toastify";

const PointRecorded = ({ sensorData, baseData, projectId }) => {
  const { backendUrl, setShowPointRecorded, fetchPoints, points } = useContext(Context);

  const [pointName, setPointName] = useState("New Point");
  const [loading, setLoading] = useState(false);
  const [clientDevice, setClientDevice] = useState();
  const [isTakePoint, setIsTakePoint] = useState(false);

  useEffect(() => {
    if (sensorData && sensorData.length > 0) {
      setIsTakePoint(true);
      const device = sensorData.find((data) => data.deviceName !== "N/A");
      if (device) {
        console.log("Device auto selected: ", device.deviceName);
        setClientDevice(device);
      }
    }
  }, [sensorData]);

  useEffect(() => {
    if (points) {
      setPointName(`Point ${points.length + 1}`);
    }
  }, [points]);

  const handleSave = async () => {
    // Ensure sensor data is available
    if (!clientDevice.latitude || !clientDevice.longitude) {
      toast.error("No sensor data available to record a point.");
      return;
    }
    setLoading(true);

    // Do correction for lan, lat here : Kind a logic thing

    const payload = {
      ProjectId: projectId,
      Name: pointName,
      Type: "recorded",
      Latitude: clientDevice.latitude,
      Longitude: clientDevice.longitude,
      Accuracy: clientDevice.accuracy || null,
      Timestamp: new Date().toISOString(),
      Device: clientDevice.Name || null,
    };

    try {
      const response = await axios.post(`${backendUrl}/api/points`, payload);
      if (response.data._id) {
        toast.success("Point recorded successfully.");
        // Refresh the points list so the new point appears on the map
        await fetchPoints(projectId);
        setShowPointRecorded(false);
      } else {
        toast.error("Failed to record point.");
      }
    } catch (error) {
      console.error("Error recording point:", error);
      toast.error("Error recording point.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="bg-white p-2 rounded-2xl shadow-lg 
      w-full md:w-[280px] 
      text-center"
      >
        {/* Title */}
        <h2 className="sm:text-lg md:text-xl font-bold">Record a Point</h2>
        <p className="text-green-500 text-sm  md:text-base font-semibold mt-1">
          Accuracy: {clientDevice?.accuracy || "N/A"}
        </p>

        {/* Divider */}
        <div className="border-t border-black my-3"></div>

        <div className="mt-4 px-4">
          <label className="block text-sm md:text-base text-gray-700">
            Rename the new point
          </label>
          <input
            type="text"
            value={pointName}
            onChange={(e) => setPointName(e.target.value)}
            className="w-full  mt-1 p-1 border rounded-xl text-sm md:text-base text-center"
            style={{ backgroundColor: "rgba(232, 232, 232, 1)" }}
          />
        </div>

        <div className="mt-4 px-4">
            <label className="block text-sm md:text-base text-gray-700">
              Select a section
            </label>
            <select
              className="w-full mt-1 p-1 border rounded-xl text-sm md:text-base"
              style={{ backgroundColor: "rgba(232, 232, 232, 1)" }}
              value={selectedSection || ""}
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              <option value="">Select a section...</option>
              {projectSections && projectSections.length > 0 &&
                projectSections.map((section, idx) => (
            <option key={idx} value={section}>
              {section}
            </option>
                ))}
            </select>
            <button
              className="mt-2 w-full bg-blue-500 text-white p-1 rounded-xl text-sm md:text-base"
              type="button"
              onClick={() => {
                const newSection = prompt("Enter new section name:");
                if (newSection && !projectSections.includes(newSection)) {
            setProjectSections([...projectSections, newSection]);
            setSelectedSection(newSection);
                }
              }}
            >
              + Add New Section
            </button>
          </div>

        <div className="mt-4 px-4">
          <label className="block text-sm md:text-base text-gray-700">
            Select Client Device
          </label>
          {sensorData && sensorData.length > 0 ? (
            <select
              value={clientDevice?.deviceName || ""}
              onChange={(e) => {
                const device = sensorData.find(
                  (d) => d.deviceName === e.target.value
                );
                setClientDevice(device);
              }}
              className="w-full mt-1 p-1 border rounded-xl text-sm md:text-base"
              style={{ backgroundColor: "rgba(232, 232, 232, 1)" }}
            >
              <option value="">Select a device...</option>
              {sensorData.map(
                (device, index) =>
                  device.deviceName !== "N/A" && (
                    <option key={index} value={device.deviceName}>
                      {device.deviceName}
                    </option>
                  )
              )}
            </select>
          ) : (
            <div className="text-red-500 text-sm mt-1">
              No client devices connected. Please connect a device first.
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-4 px-4 flex flex-col gap-2 ">
          <button
            className="bg-black text-white p-2 rounded-xl text-sm md:text-base"
            onClick={handleSave}
            disabled={loading || !isTakePoint}
            style={{
              backgroundColor: loading || !isTakePoint ? "grey" : "black",
            }}
          >
            {loading ? "Saving..." : "Save"}
          </button>

          <button
            className="border border-black p-1 rounded-xl text-sm md:text-base mb-2"
            style={{ backgroundColor: "rgba(232, 232, 232, 1)" }}
            onClick={() => setShowPointRecorded(false)}
            disabled={loading}
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PointRecorded;

import React, { useState, useContext, useEffect } from "react";
import { Context } from "../context/Context";
import axios from "axios";
import { toast } from "react-toastify";
import { use } from "react";

const PointRecorded = ({ sensorData, baseData, projectId }) => {
  const {
    backendUrl,
    setShowPointRecorded,
    fetchPoints,
    points,
    project,
    updateProjectSections,
  } = useContext(Context);


  
  const [pointName, setPointName] = useState("New Point");
  const [loading, setLoading] = useState(false);
  const [clientDevice, setClientDevice] = useState();
  const [isTakePoint, setIsTakePoint] = useState(false);
  const [selectedSection, setSelectedSection] = useState("");
  const [projectSections, setProjectSections] = useState(() =>
    Array.isArray(project?.Sections) ? project.Sections : []
  );

  const [correctedLatitude, setCorrectedLatitude] = useState(null);
  const [correctedLongitude, setCorrectedLongitude] = useState(null);

  const [clientResponses, setClientResponses] = useState([]);
  const [baseResponses, setBaseResponses] = useState([]);



  const [clientMatchData, setClientMatchData] = useState();
  const [baseMatchData, setBaseMatchData] = useState();
  const [minDelta, setMinDelta] = useState(Infinity);



  useEffect(() => {

    if (clientResponses.length > 0 && baseResponses.length > 0) {
      
      let minDelta_tmp = Infinity;
      let matchedClient = null;
      let matchedBase = null;

      clientResponses.forEach(client => {
        baseResponses.forEach(base => {
          const clientTime = new Date(client.timestamp).getTime();
          const baseTime = new Date(base.timestamp).getTime();
          const delta = Math.abs(clientTime - baseTime);
          if (delta < minDelta_tmp) {
            minDelta_tmp = delta;
            
            matchedClient = client;
            matchedBase = base;
          }
        });
      });

      setMinDelta(minDelta_tmp);
      setClientMatchData(matchedClient);
      setBaseMatchData(matchedBase);
      console.log("Time Delay: ", minDelta_tmp);
    }

  }, [clientResponses, baseResponses]);


  useEffect(() => {
    
    if (
      project?.baseMode === "known" &&
      clientMatchData &&
      typeof clientMatchData.latitude === "number" &&
      typeof clientMatchData.longitude === "number" &&
      baseMatchData &&
      typeof baseMatchData.latitude === "number" &&
      typeof baseMatchData.longitude === "number"
    ) {

        if (minDelta > 10) {
        clientDevice.accuracy = "Low";
      } else if (minDelta > 3) {
        clientDevice.accuracy = "Medium";
      } else {
        clientDevice.accuracy = "High";
      }

      const deltaLat = project.baseLatitude - baseData.baseLatitude;
      const deltaLng = project.baseLongitude - baseData.baseLongitude;
 
      setCorrectedLatitude(clientMatchData.latitude + deltaLat);
      setCorrectedLongitude(clientMatchData.longitude + deltaLng);
    } else {
      //  Auto fix
      console.log("Auto Fix running");
      setCorrectedLatitude(clientDevice?.latitude || null);
      setCorrectedLongitude(clientDevice?.longitude || null);
    }
  }, [project,baseMatchData,clientMatchData, clientDevice]);



  useEffect(() => {
    if (clientDevice && clientDevice.deviceName !== 'N/A') {
      setClientResponses(prev => {
      const updated = [...prev, { ...clientDevice, timestamp: clientDevice.timestamp }];
      return updated.length > 10 ? updated.slice(updated.length - 10) : updated;
      });
    }

  }, [clientDevice]);


  useEffect(() => {

    if ( baseData && baseData.deviceName !== 'N/A'){
        
      setBaseResponses(prev => {
              const updated = [...prev, { ...baseData, timestamp: baseData.timestamp }];
              return updated.length > 10 ? updated.slice(updated.length - 10) : updated;
            });

      } 

  }, [baseData]);



  useEffect(() => {
  console.log("Updated Client Responses: ", clientResponses);
}, [clientResponses]);

useEffect(() => {
  console.log("Updated Base Responses: ", baseResponses);
}, [baseResponses]);


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

  useEffect(() => {
    if (projectSections.length > 0 && !selectedSection) {
      setSelectedSection(projectSections[0]);
    }
  }, [projectSections, selectedSection]);

  const handleSectionChange = (e) => {
    const value = e.target.value;

    if (value === "__add_new__") {
      const newSection = prompt("Enter new section name:");
      if (newSection && !projectSections.includes(newSection)) {
        const updated = [...projectSections, newSection];
        setProjectSections(updated);
        setSelectedSection(newSection);
        updateProjectSections(project._id, newSection);
      }
    } else {
      setSelectedSection(value);
    }
  };

  const handleSave = async () => {
    ///////////////////////////////////
    // Ensure sensor data is available
    if (!clientDevice.latitude || !clientDevice.longitude) {
      toast.error("No sensor data available to record a point.");
      return;
    }
    setLoading(true);

    const payload = {
      ProjectId: projectId,
      Name: pointName,
      Type: "recorded",
      Latitude: correctedLatitude,
      Longitude: correctedLongitude,
      Accuracy: clientDevice.accuracy || null,
      Timestamp: new Date().toISOString(),
      Device: clientDevice.Name || null,
      Section: selectedSection || "default",
    };

    try {
      const response = await axios.post(`${backendUrl}/api/points/`, payload);
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

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setShowPointRecorded(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setShowPointRecorded]);

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-[5px] z-[2000]
                 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) setShowPointRecorded(false);
      }}
    >
      <div
        className="bg-white p-2 mx-4 rounded-2xl shadow-lg 
      w-full md:w-[380px] 
      text-center"
      >
        {/* /* Title  */}
        <h2 className="sm:text-lg md:text-xl font-bold">Record a Point</h2>
        <p
          className={`text-sm md:text-base font-semibold mt-1 ${
            clientDevice?.accuracy === "Low"
              ? "text-red-500"
              : clientDevice?.accuracy === "Medium"
              ? "text-yellow-500"
              : clientDevice?.accuracy === "High"
              ? "text-green-500"
              : "text-gray-500"
          }`}
        >
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

        {/* Section Selection */}
        <div className="mt-4 px-4">
          <label className="block text-sm md:text-base text-gray-700">
            Select a section
          </label>
          <select
            className="w-full mt-1 p-1 border rounded-xl text-sm md:text-base"
            style={{ backgroundColor: "rgba(232, 232, 232, 1)" }}
            value={selectedSection || ""}
            onChange={handleSectionChange}
          >
            <option value="">Select a section...</option>
            {/* {projectSections.map((section, idx) => (
              <option key={idx} value={section}>
                {section}
              </option>
            ))} */}
            {(Array.isArray(projectSections) ? projectSections : []).map(
              (section, idx) => (
                <option key={idx} value={section}>
                  {section}
                </option>
              )
            )}
            <option value="__add_new__"> Add new section...</option>
          </select>
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
            className=" p-1 rounded-xl text-sm md:text-base mb-2"
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

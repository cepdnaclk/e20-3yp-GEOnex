import React, { useState, useContext, useEffect, useRef } from "react";
import { Context } from "../context/Context";
import axios from "axios";
import { toast } from "react-toastify";

class KalmanFilter {
  constructor(processNoise = 0.0001, measurementNoise = 0.01, estimateError = 1, initialValue = 0) {
    this.q = Number(processNoise);
    this.r = Number(measurementNoise);
    this.p = Number(estimateError);
    this.x = Number(initialValue);
  }

  update(measurement) {
    // Convert to number and validate
    const numMeasurement = Number(measurement);
    if (isNaN(numMeasurement)) {
      console.warn('Invalid measurement received:', measurement);
      return this.x; // Return current estimate for invalid input
    }

    this.p = this.p + this.q;
    const k = this.p / (this.p + this.r);

    if (isNaN(k)) {
      console.warn('Kalman gain is NaN, returning current estimate');
      return this.x;
    }

    this.x = this.x + k * (numMeasurement - this.x);
    this.p = (1 - k) * this.p;

    return this.x;
  }

  // Helper method to check filter state
  getState() {
    return {
      estimate: this.x,
      errorCovariance: this.p,
      processNoise: this.q,
      measurementNoise: this.r
    };
  }
}


const PointRecorded = ({
  sensorData,
  baseData,
  projectId,
  autoSave = false,
}) => {
  const {
    backendUrl,
    setShowPointRecorded,
    fetchPoints,
    points,
    project,
    fetchProject,
    updateProjectSections,
    lastSelectedSection,
    setLastSelectedSection,
  } = useContext(Context);

  const [pointName, setPointName] = useState("New Point");
  const [loading, setLoading] = useState(false);
  const [clientDevice, setClientDevice] = useState();
  const [isTakePoint, setIsTakePoint] = useState(false);

  const [selectedSection, setSelectedSection] = useState(
    lastSelectedSection || ""
  );
  const [projectSections, setProjectSections] = useState([]);

  const [correctedLatitude, setCorrectedLatitude] = useState(null);
  const [correctedLongitude, setCorrectedLongitude] = useState(null);

  const [clientResponses, setClientResponses] = useState([]);
  const [baseResponses, setBaseResponses] = useState([]);

  const [clientMatchData, setClientMatchData] = useState();
  const [baseMatchData, setBaseMatchData] = useState();
  const [minDelta, setMinDelta] = useState(Infinity);



  const latFilter = useRef(null);
  const lngFilter = useRef(null);


  useEffect(() => {
    fetchProject(projectId);
  }, [projectId]);


  useEffect(() => {
    if (project?.baseLatitude && project?.baseLongitude) {
      if (!isNaN(project.baseLatitude) && !isNaN(project.baseLongitude)) {
          latFilter.current = new KalmanFilter(0.0001, 0.0005, 1, project.baseLatitude);
          lngFilter.current = new KalmanFilter(0.0001, 0.0005, 1, project.baseLongitude);
}
    }
  }, [project?.baseLatitude, project?.baseLongitude]);


  useEffect(() => {
    console.log("Project.Sections changed:", project?.Sections);
    if (Array.isArray(project?.Sections)) {
      setProjectSections(project.Sections);
    }
  }, [project?.Sections]);

  useEffect(() => {
    if (clientResponses.length > 0 && baseResponses.length > 0) {
      let minDelta_tmp = Infinity;
      let matchedClient = null;
      let matchedBase = null;

      clientResponses.forEach((client) => {
        baseResponses.forEach((base) => {
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
      if (minDelta > 5000) {
        clientDevice.accuracy = "Low";
      } else if (minDelta > 2000) {
        clientDevice.accuracy = "Medium";
      } else {
        clientDevice.accuracy = "High";
      }

      const deltaLat = project.baseLatitude - baseMatchData.latitude;
      const deltaLng = project.baseLongitude - baseMatchData.longitude;

      const correctedLat = clientMatchData.latitude + deltaLat;
      const correctedLng = clientMatchData.longitude + deltaLng;

      if (
          latFilter.current &&
          lngFilter.current &&
          typeof correctedLat === "number" &&
          typeof correctedLng === "number" &&
          !isNaN(correctedLat) &&
          !isNaN(correctedLng)
        ) {


          
          const smoothLat = (latFilter.current.update(correctedLat));
          const smoothLng = lngFilter.current.update(correctedLng);

          setCorrectedLatitude(smoothLat);
          setCorrectedLongitude(smoothLng);

          console.log("typeOf: ", typeof(smoothLat));

          console.log("Kalman Filter Applied");
          console.log("Smoothed:", smoothLat, smoothLng);

        } else {
          setCorrectedLatitude(correctedLat);
          setCorrectedLongitude(correctedLng);

          console.log("No Kalman Filter Applied (missing filters or invalid data)");
          console.log("Corrected (Raw):", correctedLat, correctedLng);
        }


    } else {
      //  Auto fix
      console.log("Auto Fix running");
      setCorrectedLatitude(clientDevice?.latitude || null);
      setCorrectedLongitude(clientDevice?.longitude || null);
    }
  }, [project, baseMatchData, clientMatchData, clientDevice]);

  useEffect(() => {
    if (clientDevice && clientDevice.deviceName !== "N/A") {
      setClientResponses((prev) => {
        const updated = [
          ...prev,
          { ...clientDevice, timestamp: clientDevice.timestamp },
        ];
        return updated.length > 10
          ? updated.slice(updated.length - 10)
          : updated;
      });
    }
  }, [clientDevice]);

  useEffect(() => {
    if (baseData && baseData.deviceName !== "N/A") {
      setBaseResponses((prev) => {
        const updated = [
          ...prev,
          { ...baseData, timestamp: baseData.timestamp },
        ];
        return updated.length > 10
          ? updated.slice(updated.length - 10)
          : updated;
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
      setPointName(`P ${points.length + 1}`);
    }
  }, [points]);

  useEffect(() => {
    if (projectSections.length > 0 && !selectedSection) {
      setSelectedSection(lastSelectedSection ?? projectSections[0]);
    }
  }, [projectSections, selectedSection, lastSelectedSection]);

  const handleSectionChange = (e) => {
    const value = e.target.value;

    if (value === "__add_new__") {
      const newSection = prompt("Enter new section name:");
      if (newSection && !projectSections.includes(newSection)) {
        const updated = [...projectSections, newSection];
        setProjectSections(updated);
        setSelectedSection(newSection);
        setLastSelectedSection(newSection);
        updateProjectSections(project._id, newSection);
      }
    } else {
      setSelectedSection(value);
      setLastSelectedSection(value); // remember choice
    }
  };

  const handleSave = async () => {
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

  useEffect(() => {
    if (
      autoSave &&
      isTakePoint && // rover chosen
      correctedLatitude !== null && // corrections (or fallbacks) ready
      correctedLongitude !== null &&
      !loading
    ) {
      handleSave(); // triggers once
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSave, isTakePoint, correctedLatitude, correctedLongitude, loading]);

  useEffect(() => {
  if (!autoSave) return;

  const t = setTimeout(() => {
    if (
      !isTakePoint ||
      correctedLatitude === null ||
      correctedLongitude === null
    ) {
      toast.error("No sensor data - point not recorded");
      setShowPointRecorded(false);   // close the hidden modal
    }
  }, 1500); // ms

  return () => clearTimeout(t);
}, [autoSave, isTakePoint, correctedLatitude, correctedLongitude]);


  return (
    <div
      className={
        autoSave
          ? "hidden" // still mounted but invisible
          : "fixed inset-0 bg-black/30 backdrop-blur-[5px] z-[2000] flex items-center justify-center"
      }
      onClick={(e) =>
        !autoSave && e.target === e.currentTarget && setShowPointRecorded(false)
      }
    >
      {!autoSave && (
        <div
          className="bg-white p-2 mx-4 rounded-2xl shadow-lg 
                  w-full md:w-[380px] text-center"
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
              {Array.isArray(projectSections) &&
              projectSections.length === 0 ? (
                <option disabled>Loading sections...</option>
              ) : (
                projectSections.map((section, idx) => (
                  <option key={idx} value={section}>
                    {section}
                  </option>
                ))
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
      )}
    </div>
  );
};

export default PointRecorded;

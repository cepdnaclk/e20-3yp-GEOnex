import LoadingSpinner from "./LoadingSpinner";
import React, { useState, useEffect, useContext } from "react";
import dayjs from "dayjs";
import { Context } from "../context/Context";
import DeviceGridMap from "./DeviceGridMap";
import useBaseSensorData from "./useBaseSensorData";
import useSensorData from "./useSensorData";

export default function MapDeviceData() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [center, setCenter] = useState(null);
  const [base, setBase] = useState(null);
  const [points, setPoints] = useState([]);

  const { userData , backendUrl, wsUrl, project} = useContext(Context);

  // Mock user ID (in real app, this would come from auth context)
  const userId = userData.userId;

    // mock devices 
    const rovers = Array.isArray(project?.ClientDevices) && project.ClientDevices.length > 0? project.ClientDevices.map(device => device.DeviceCode): ["device123", "device456"];

    const baseStation = project?.BaseStation?.DeviceCode || "base123";
    
    // Define your WebSocket URL here
    const WS_URL = `${wsUrl}`;
    
    // Use our custom hook to get sensor data and connection status
    const { sensorData, connectionStatus } = useSensorData(WS_URL, rovers);
    const { baseSensorData, baseConnectionStatus } = useBaseSensorData(WS_URL, baseStation);

  // Update the base position when base sensor data updates
  useEffect(() => {
    console.log("Base Sensor Data:", baseSensorData);
    if (
      baseSensorData &&
      typeof baseSensorData.latitude === "number" &&
      typeof baseSensorData.longitude === "number"
    ) {
      setBase({
        lat: baseSensorData.latitude,
        lng: baseSensorData.longitude,
      });
    }
  }, [baseSensorData, baseStation]);

  // Update the center position based on rover and base positions
  useEffect(() => {
    // If we have valid sensor data from rovers
    if (Array.isArray(sensorData) && sensorData.length > 0) {
      const validRoverData = sensorData.filter(
        (data) =>
          data &&
          typeof data.latitude === "number" &&
          typeof data.longitude === "number"
      );

      if (validRoverData.length > 0) {
        // Calculate average of all valid rover positions
        const avgLat =
          validRoverData.reduce((sum, data) => sum + data.latitude, 0) /
          validRoverData.length;
        const avgLng =
          validRoverData.reduce((sum, data) => sum + data.longitude, 0) /
          validRoverData.length;

        setCenter({
          lat: avgLat,
          lng: avgLng,
        });
      }
    } else if (points && points.length > 0) {
      // Calculate average of fetched points
      const avgLat =
        points.reduce((sum, point) => sum + point.Latitude, 0) / points.length;
      const avgLng =
        points.reduce((sum, point) => sum + point.Longitude, 0) / points.length;
      setCenter({
        lat: avgLat,
        lng: avgLng,
      });
    } else if (base) {
      // If no valid rover data, set center to base position
      setCenter({
        lat: base.lat,
        lng: base.lng,
      });
    }
  }, [sensorData, base, points]);

  return (
    <>
      <div className="flex flex-col w-full p-1 pb-0">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold">
              Device Map
            </h1>
            {/* <div className="flex gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  connectionStatus === "connected"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              ></div>
              <span className="text-xs md:text-sm lg:text-base text-gray-500 dark:text-gray-400">
                Rovers: {connectionStatus}
              </span>
              <div
                className={`w-2 h-2 rounded-full ${
                  baseConnectionStatus === "connected"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              ></div>
              <span className="text-xs md:text-sm lg:text-base text-gray-500 dark:text-gray-400">
                Base: {baseConnectionStatus}
              </span>
            </div> */}
          </div>

          {error && (
            <p className="text-red-500 dark:text-red-400 text-xs md:text-sm lg:text-base">
              {error}
            </p>
          )}
          {success && (
            <p className="text-green-500 dark:text-green-400 text-xs md:text-sm lg:text-base">
              {success}
            </p>
          )}
        </div>

        {/* Map component with explicit height */}
        <div className="w-full flex-grow h-full pt-6">
          <DeviceGridMap
            sensorData={sensorData}
            baseSensorData={baseSensorData}
            center={center}
            base={base}
            points={points}
            connectionStatus={connectionStatus}
            baseConnectionStatus={baseConnectionStatus}
          />
        </div>
      </div>
    </>
  );
}

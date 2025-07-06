import React, { useState, useRef, useEffect, useContext } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { assets } from "../assets/assets";
import PointRecorded from "./PointRecorded";
import ConfirmDiscard from "./ConfirmDiscard";
import { Context } from "../context/Context";
import useSensorData from "./useSensorData";
import useBaseSensorData from "./useBaseSensorData";
import LoadingSpinner from "./LoadingSpinner";

import { useParams } from "react-router-dom";
import "./MarkerStyles.css";
import MapPopUp from "./MapPopUp";

// Hook to track window width
function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth });
  useEffect(() => {
    const handle = () => setSize({ width: window.innerWidth });
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);
  return size;
}

const MapSection = () => {
  const { projectId } = useParams();
  const ZOOM_LEVEL = 20;
  const mapRef = useRef();
  const { width } = useWindowSize();

  const [base, setBase] = useState({ lat: 7.254822, lng: 80.59252 });
  const [center, setCenter] = useState({ lat: 7.254822, lng: 80.59215 });

  const {
    navigate,
    fetchPoints,
    points,
    setPoints,
    loadingPoints,
    showPointRecorded,
    setShowPointRecorded,
    showConfirmDiscard,
    setShowConfirmDiscard,
    wsUrl,
  } = useContext(Context);

  // mock devices
  const rovers = ["device123", "device456"];

  const baseStation = "base123";
  // Define your WebSocket URL here
  const WS_URL = `${wsUrl}`;
  // Use our custom hook to get sensor data and connection status
  const { sensorData, connectionStatus } = useSensorData(WS_URL, rovers);
  const { baseSensorData, baseconnectionStatus } = useBaseSensorData(
    WS_URL,
    baseStation
  );

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

  // Fetch previously recorded points from Context when projectId changes
  useEffect(() => {
    if (projectId) {
      fetchPoints(projectId);
    }
  }, [projectId]);

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

  // Recenter the map when center state changes
  const RecenterAutomatically = ({ center }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(center);
    }, [center, map]);
    return null;
  };

  // Choose marker size based on width
  const getSize = () => {
    if (width < 640) return [30, 30];
    if (width < 768) return [35, 35];
    return [40, 40];
  };
  const [iconSize, setIconSize] = useState(getSize());

  // Update iconSize on resize
  useEffect(() => {
    setIconSize(getSize());
  }, [width]);

  const staticTakenPointIcon = L.divIcon({
    className: "",
    html: `
    <div class="relative w-3 h-3">
      <div class="w-full h-full bg-blue-600 rounded-full border-2 border-white shadow-md"></div>
    </div>
  `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  const pulseIcon = L.divIcon({
    className: "",
    html: `
    <div class="relative w-10 h-10">
      <div class="absolute w-full h-full bg-blue-500 rounded-full opacity-60 animate-pulse-signal"></div>
      <div class="absolute w-2.5 h-2.5 bg-blue-600 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"></div>
    </div>
  `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  const baseIcon = L.divIcon({
    className: "",
    html: `
    <div class="relative w-12 h-12">
      <div class="absolute w-full h-full bg-gray-500 rounded-full opacity-60 animate-wave"></div>
      <div class="absolute w-full h-full bg-gray-600 rounded-full opacity-60 animate-wave-delay"></div>
      
      <div class="absolute w-3 h-3 bg-gray-900 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"></div>
    </div>
  `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  return (
    <div
      className="w-full h-full relative p-2 bg-[rgba(232,232,232,1)] dark:bg-gray-900 text-gray-900"
    >
      <MapContainer
        center={center}
        zoom={ZOOM_LEVEL}
        ref={mapRef}
        className="w-full h-full p-2"
      >
        <TileLayer
          url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=adWhcNjZozsvPpfwl4Zo"
          //https://api.maptiler.com/maps/outdoor-v2/256/{z}/{x}/{y}.png?key=adWhcNjZozsvPpfwl4Zo
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <RecenterAutomatically center={center} />

        <MapFix />
        {/* Live Device Markers */}
        {sensorData.map((data) => (
          <Marker
            key={data.deviceName}
            position={[data.latitude, data.longitude]}
            icon={pulseIcon}
          >
            <Popup>
              <MapPopUp
                battery={data.battery}
                deviceName={data.deviceName}
                signal={data.signal}
                status={data.status}
              />
            </Popup>

            <Tooltip
              permanent={true}
              direction="right"
              offset={[10, 10]}
              className="modern-tooltip"
            >
              <span className="point-name">{data.deviceName || "Rover"}</span>
            </Tooltip>
          </Marker>
        ))}

        {/* Base Device Marker */}
        <Marker position={[base.lat, base.lng]} icon={baseIcon}>
          <Popup>
            <MapPopUp
              battery={baseSensorData.battery}
              deviceName={baseSensorData.deviceName}
              signal={baseSensorData.signal}
              status={baseSensorData.status}
            />
          </Popup>

          <Tooltip
            permanent={true}
            direction="right"
            offset={[10, 10]}
            className="modern-tooltip"
          >
            <span className="point-name">
              {baseSensorData.deviceName || "Base"}
            </span>
          </Tooltip>
        </Marker>

        {/* Recorded Points Markers (from Context) */}
        {!loadingPoints &&
          points.map((point) => (
            <Marker
              key={point._id}
              position={[point.Latitude, point.Longitude]}
              icon={staticTakenPointIcon}
            >
              <Tooltip
                permanent={true}
                direction="top"
                offset={[0, -10]}
                className="modern-tooltip"
              >
                <span className="point-name">
                  {point.Name || "Unnamed Point"}
                </span>
              </Tooltip>
            </Marker>
          ))}

        {/* Loading Overlay */}
        {loadingPoints && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1500] backdrop-blur-0">
            <LoadingSpinner size={10} />
            {/* Replace with a spinner or skeleton loader if desired */}
          </div>
        )}
      </MapContainer>

      {/* Display connection status (optional for debugging) */}
      <div className="absolute top-4 left-4 bg-white p-2 rounded shadow">
        <p>Status: {connectionStatus}</p>
        <p>Base Status: {baseconnectionStatus}</p>
      </div>

      {/* Buttons on the bottom right */}
      <div className="absolute bottom-10 right-8 flex flex-col gap-1 md:gap-2 z-[1000] items-center">
        {/* Taken points button */}
        <button
          className="bg-black p-3 md:p-3 rounded-full shadow-md w-12 h-12 md:w-12 md:h-12 flex items-center justify-center "
          onClick={() => {
            navigate(`/projects/takenpoints/${projectId}`);
          }}
        >
          <img
            src={assets.filter}
            alt="Button 1"
            className="w-6 h-6 md:w-6 md:h-6"
          />
        </button>

        {/* Button 2 */}
        <button
          className="bg-orange-500 p-3 md:p-3 rounded-full shadow-md w-12 h-12 md:w-12 md:h-12 flex items-center "
          onClick={() => setShowConfirmDiscard(true)}
        >
          <img
            src={assets.reverse}
            alt="Button 2"
            className="w-6 h-6 md:w-6 md:h-6"
          />
        </button>

        {/* Button 3 */}
        <button
          className="bg-blue-500 p-3 md:p-4 rounded-full shadow-md w-14 h-14 md:w-16 md:h-16 flex items-center "
          onClick={() => setShowPointRecorded(true)}
        >
          <img
            src={assets.add_location}
            alt="Button 3"
            className="w-8 h-8 md:w-8 md:h-8"
          />
        </button>
      </div>

      {/* Show Point Recorded Popup */}
      {showPointRecorded && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[5px] z-[2000]">
          <PointRecorded
            sensorData={sensorData}
            baseData={baseSensorData}
            projectId={projectId}
          />
        </div>
      )}

      {/* Show Confirm Discard Popup */}
      {showConfirmDiscard && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[5px] z-[2000]">
          <ConfirmDiscard projectId={projectId} />
        </div>
      )}
    </div>
  );
};

// Custom component to invalidate size on load
const MapFix = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 400); // Small delay ensures proper resizing
  }, [map]);
  return null;
};

export default MapSection;

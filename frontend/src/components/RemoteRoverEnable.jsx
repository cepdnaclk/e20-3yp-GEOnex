import React from "react";
import { useState, useContext } from "react";
import { Context } from "../context/Context";
import { MapPin, Wifi, WifiOff } from "lucide-react";

const RemoteRoverEnable = () => {
  const { project, setProject } = useContext(Context);

  // Device management state
  const [devices, setDevices] = useState([
    {
      id: "ROVER_001",
      name: "GEOnex Rover #1",
      status: "online",
      battery: 85,
      enabled: false,
    },
    {
      id: "ROVER_002",
      name: "GEOnex Rover #2",
      status: "offline",
      battery: 42,
      enabled: false,
    },
    {
      id: "BASE_001",
      name: "Base Station Alpha",
      status: "online",
      battery: 100,
      enabled: true,
    },
    {
      id: "MOBILE_001",
      name: "Mobile Unit Beta",
      status: "busy",
      battery: 67,
      enabled: false,
    },
  ]);

  // Recording state
  const [recording, setRecording] = useState({});
  const [recordedPoints, setRecordedPoints] = useState([]);

  // Toggle device enabled/disabled
  const toggleDevice = (deviceId) => {
    setDevices((prev) =>
      prev.map((device) =>
        device.id === deviceId
          ? { ...device, enabled: !device.enabled }
          : device
      )
    );
  };

  // Toggle recording for a device
  const toggleRecording = (deviceId) => {
    const device = devices.find((d) => d.id === deviceId);

    if (!device.enabled) {
      alert("Please enable the device first");
      return;
    }

    if (device.status === "offline") {
      alert("Device is offline");
      return;
    }

    const isCurrentlyRecording = recording[deviceId];

    if (isCurrentlyRecording) {
      // Stop recording
      setRecording((prev) => ({ ...prev, [deviceId]: false }));
    } else {
      // Start recording
      setRecording((prev) => ({ ...prev, [deviceId]: true }));

      // Simulate point recording
      setTimeout(() => {
        const newPoint = {
          id: `POINT_${Date.now()}`,
          deviceId: deviceId,
          deviceName: device.name,
          coordinates: {
            lat: (Math.random() * 180 - 90).toFixed(6),
            lng: (Math.random() * 360 - 180).toFixed(6),
            elevation: (Math.random() * 1000).toFixed(2),
          },
          timestamp: new Date(),
          accuracy: (Math.random() * 2 + 0.5).toFixed(2),
        };

        setRecordedPoints((prev) => [newPoint, ...prev]);
        setRecording((prev) => ({ ...prev, [deviceId]: false }));
      }, 2000);
    }
  };

  // iOS-style toggle switch component
  const ToggleSwitch = ({ enabled, onToggle, disabled = false }) => (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        enabled
          ? "bg-blue-600"
          : disabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-gray-400 "
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg flex flex-col gap-4 h-max">
      <h2 className="text-base md:text-lg font-semibold pb-2 border-b">
        Remote Client Devices
      </h2>

      {/* Device List */}
      <div className="space-y-4">
        {devices.map((device) => (
          <div
            key={device.id}
            className="flex items-center justify-between p-4 bg-[rgba(232,232,232,1)]
            dark:bg-gray-700 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {device.status === "online" ? (
                  <Wifi className="h-4 w-4 text-green-600" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-600" />
                )}
                <div>
                  <h3 className="font-medium text-sm">{device.name}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {device.status} • Battery: {device.battery}%
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Device Enable Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-800 dark:text-gray-300">Enable</span>
                <ToggleSwitch
                  enabled={device.enabled}
                  onToggle={() => toggleDevice(device.id)}
                  disabled={device.status === "offline"}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Points */}
      {recordedPoints.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Recent Points ({recordedPoints.length})
          </h3>
          <div className="max-h-32 overflow-y-auto space-y-2">
            {recordedPoints.slice(0, 5).map((point) => (
              <div key={point.id} className="text-xs p-2 bg-blue-50 rounded">
                <div className="flex justify-between items-start">
                  <span className="font-medium">{point.deviceName}</span>
                  <span className="text-gray-500">
                    {point.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-gray-600 mt-1">
                  {point.coordinates.lat}, {point.coordinates.lng}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RemoteRoverEnable;

import { Context } from "../context/Context";
import LoadingSpinner from "./LoadingSpinner";
import React, { useState, useEffect,useContext } from "react";





export default function ConnectedDevices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [DeviceCode, setDeviceCode] = useState("");
  const [connectingDevice, setConnectingDevice] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { userData,backendUrl, navigate } = useContext(Context);

    const userId = userData.userId;




  useEffect(() => {
    fetchUserDevices();
  }, []);

  const handleDeleteDevice = async (deviceId, userId) => {
    const ok = window.confirm(
      "Remove this device from your account?\nThis action cannot be undone."
    );
    if (!ok) return;
    setError("");
    setSuccess("");
    try {
      const response = await fetch(
        `${backendUrl}/api/user/${userId}/remove-device`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ deviceId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete device");
      }

      setSuccess("Device removed successfully!");
      fetchUserDevices();
    } catch (error) {
      console.error("Error deleting device:", error);
      setError(error.message);
    } finally {
      setConnectingDevice(false);
    }
  };

  const fetchUserDevices = async () => {
    setLoading(true);
    try {
        const response = await fetch(`${backendUrl}/api/user/${userId}/devices`);
        if (!response.ok) {
            throw new Error("Failed to fetch devices");
        }

      const data = await response.json();
      console.log("Full response:", data);

      // Access the connectedDevices array from the response
      setDevices(data.connectedDevices || []);
    } catch (error) {
      console.error("Error fetching devices:", error);
      setError("Failed to load connected devices");
    } finally {
      setLoading(false);
    }
  };

  const handleConnectDevice = async (e) => {
    e.preventDefault();
    if (!DeviceCode.trim()) {
      setError("Please enter a device ID");
      return;
    }

    setConnectingDevice(true);
    setError("");
    setSuccess("");

        try {
            // First check if device exists and is not connected to a project
            const checkResponse = await fetch(`${backendUrl}/api/devices/${DeviceCode}/check`);
            if (!checkResponse.ok) {
                throw new Error("Device not found");
            }

      const deviceData = await checkResponse.json();
      if (deviceData.isInUse) {
        throw new Error("This device is already connected to a project");
      }

            // Connect device to user
            const connectResponse = await fetch(`${backendUrl}/api/user/${userId}/add-device`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ DeviceCode }),
            });

      if (!connectResponse.ok) {
        const errorData = await connectResponse.json();
        throw new Error(errorData.message || "Failed to connect device");
      }

      setSuccess("Device connected successfully!");
      setDeviceCode("");
      // Refresh the device list
      fetchUserDevices();
    } catch (error) {
      console.error("Error connecting device:", error);
      setError(error.message);
    } finally {
      setConnectingDevice(false);
    }
  };

  const getDeviceTypeIcon = (type) => {
    if (type === "rover") {
      return (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17 10C17 13.3137 14.3137 16 11 16C7.68629 16 5 13.3137 5 10C5 6.68629 7.68629 4 11 4C14.3137 4 17 6.68629 17 10Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M11 16V20" stroke="currentColor" strokeWidth="2" />
          <path d="M7 20H15" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    } else if (type === "base") {
      return (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="5"
            y="8"
            width="14"
            height="12"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M8 8V4" stroke="currentColor" strokeWidth="2" />
          <path d="M16 8V4" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    }
    return null;
  };

  const getBatteryIcon = (level) => {
    if (level > 75) {
      return (
        <svg
          className="w-4 h-4 text-green-500"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="3"
            y="6"
            width="18"
            height="12"
            rx="1"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <rect x="5" y="8" width="14" height="8" fill="currentColor" />
          <path d="M23 13V11" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    } else if (level > 25) {
      return (
        <svg
          className="w-4 h-4 text-yellow-500"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="3"
            y="6"
            width="18"
            height="12"
            rx="1"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <rect x="5" y="8" width="7" height="8" fill="currentColor" />
          <path d="M23 13V11" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    } else {
      return (
        <svg
          className="w-4 h-4 text-red-500"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="3"
            y="6"
            width="18"
            height="12"
            rx="1"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <rect x="5" y="8" width="3" height="8" fill="currentColor" />
          <path d="M23 13V11" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    }
  };

  const getSignalIcon = (strength) => {
    if (strength > 75) {
      return (
        <svg
          className="w-4 h-4 text-green-500"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M2 20h2V10H2v10zm4 0h2V4H6v16zm4 0h2v-8h-2v8zm4 0h2V8h-2v12zm4 0h2v-4h-2v4z" />
        </svg>
      );
    } else if (strength > 25) {
      return (
        <svg
          className="w-4 h-4 text-yellow-500"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M2 20h2V10H2v10zm4 0h2V4H6v16zm4 0h2v-8h-2v8z" />
          <path
            d="M14 20h2V8h-2v12zm4 0h2v-4h-2v4z"
            fill="none"
            stroke="currentColor"
          />
        </svg>
      );
    } else {
      return (
        <svg
          className="w-4 h-4 text-red-500"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M2 20h2V10H2v10zm4 0h2V4H6v16z" />
          <path
            d="M10 20h2v-8h-2v8zm4 0h2V8h-2v12zm4 0h2v-4h-2v4z"
            fill="none"
            stroke="currentColor"
          />
        </svg>
      );
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6 w-full text-gray-900 dark:text-gray-100">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold">
              Connected Devices
            </h1>
            <button
              onClick={() =>
                (window.location.href = `/devices/register-device/${userId}`)
              }
              className="bg-blue-500 hover:bg-blue-600
              dark:bg-indigo-600 dark:hover:bg-indigo-500
              px-4 py-2 rounded-lg text-sm text-white transition-colors"
            >
              Register New Device
            </button>
          </div>

          {error && (
            <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
          )}
          {success && (
            <p className="text-green-500 dark:text-green-400 text-sm">
              {success}
            </p>
          )}

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Enter Device ID"
              value={DeviceCode}
              onChange={(e) => setDeviceCode(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm 
              focus:outline-none focus:ring-2 focus:ring-blue-500
              dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100
              dark:focus:ring-indigo-500 "
            />
            <button
              onClick={handleConnectDevice}
              disabled={connectingDevice}
              className="bg-green-500 text-white px-2 py-2 rounded-md text-sm hover:bg-green-600 transition-colors 
              disabled:bg-gray-400
              dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              {connectingDevice ? "Connecting..." : "Connect"}
            </button>
          </div>
        </div>

        {/* Scroll wrapper for table */}
        <div className="overflow-x-auto w-full">
          <div className="min-w-[700px]">
            {/* Table header */}
            <div
              className="flex flex-nowrap items-center justify-between 
            bg-gray-100 p-3 rounded-lg min-w-[700px] dark:bg-gray-700"
            >
              <span className="flex-shrink-0 w-[15%] text-sm md:text-base font-semibold">
                Device ID
              </span>
              <span className="flex-shrink-0 w-[15%] text-sm md:text-base font-semibold text-center">
                Type
              </span>
              <span className="flex-shrink-0 w-[10%] text-sm md:text-base font-semibold text-center">
                Battery
              </span>
              <span className="flex-shrink-0 w-[10%] text-sm md:text-base font-semibold text-center">
                Signal
              </span>
              <span className="flex-shrink-0 w-[15%] text-sm md:text-base font-semibold text-center">
                Status
              </span>
              <span className="flex-shrink-0 w-[10%] text-sm md:text-base font-semibold text-center">
                Actions
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center w-full py-8 max-h-96">
                <LoadingSpinner />
              </div>
            ) : devices.length === 0 ? (
              <p className="text-gray-600 py-4 text-center dark:text-gray-400">
                No devices connected yet.
              </p>
            ) : (
              devices.map((device) => (
                <div
                  onClick={() => navigate(`/devices/${device._id}`)}
                  key={device._id}
                  className="flex flex-nowrap items-center justify-between 
                  bg-white p-3 rounded-lg shadow-sm border border-gray-100 min-w-[700px]
                  dark:bg-gray-800 dark:border-gray-700
                  hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <div className="flex flex-col w-[15%]">
                    <span className="text-sm font-medium">{device.Name}</span>
                    <span className="text-xs font-small">
                      {device.DeviceCode}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 justify-center flex-shrink-0 w-[15%]">
                    {getDeviceTypeIcon(device.Type)}
                    <span className="text-xs md:text-sm lg:text-base">
                      {device.Type}
                    </span>
                  </div>

                  <div className="flex justify-center flex-shrink-0 w-[10%]">
                    {getBatteryIcon(device.Battery_Percentage)}
                  </div>

                  <div className="flex justify-center flex-shrink-0 w-[10%]">
                    {getSignalIcon(device.Signal_Strength)}
                  </div>

                  <div className="flex justify-center flex-shrink-0 w-[15%]">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        device.Status
                          ? "bg-green-100 text-green-700 dark:bg-green-800/20 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-800/20 dark:text-red-400"
                      }`}
                    >
                      {device.Status ? "Online" : "Offline"}
                    </span>
                  </div>

                  <div className="flex justify-center flex-shrink-0 w-[10%]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDevice(device._id, userId);
                      }}
                      disabled={connectingDevice}
                      className="text-red-500 hover:text-red-700 hover:scale-110 transition"
                      aria-label={`Delete device ${device.DeviceCode}`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

import { Context } from "../context/Context";
import PageTopic from "../components/PageTopic";

const RegisterNewDevice = () => {
  const { navigate, backendUrl } = useContext(Context);

  const [deviceId, setDeviceId] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [deviceType, setDeviceType] = useState("rover");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { userId } = useParams();

  const handleClear = () => {
    setDeviceId("");
    setDeviceName("");
    setDeviceType("rover");
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!deviceId.trim()) {
      setError("Device ID is required");
      return;
    }

    if (!deviceName.trim()) {
      setError("Device name is required");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // Register the device
      const response = await axios.post(`${backendUrl}/api/devices/`, {
        DeviceCode: deviceId,
        Name: deviceName,
        Type: deviceType,
        Registered_User_Id: userId,
      });

      setSuccess("Device registered successfully!");

      // Wait a moment then navigate back
      setTimeout(() => {
        navigate(-1, { state: { refresh: true } });
      }, 1500);
    } catch (error) {
      console.error("Error registering device:", error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto text-gray-900 dark:text-gray-100 ">
      <div className="flex flex-col">
        <PageTopic topic="Register New Device" intro="Setup your new device" />

        {/* Registration Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          {error && (
            <div
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 
            text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800
            text-green-700 dark:text-green-400 px-4 py-3 rounded mb-4"
            >
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="deviceId"
                className="text-base md:text-lg font-medium"
              >
                Device ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="deviceId"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                className="mt-1 w-full border border-gray-300 dark:border-gray-600 
                rounded-xl shadow-sm py-2 px-3 bg-[rgba(232,232,232,1)] dark:bg-gray-700 dark:text-gray-100
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-indigo-500
                text-sm md:text-base"
                placeholder="Enter the device ID (e.g., GNSS-123456)"
              />
              <p className="text-xs md:text-base text-gray-500 dark:text-gray-400">
                You can find the device ID on the label or in the device
                documentation
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="deviceName"
                className="text-base md:text-lg font-medium"
              >
                Device Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="deviceName"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                className="mt-1 w-full border border-gray-300 dark:border-gray-600 
                rounded-xl shadow-sm py-2 px-3 bg-[rgba(232,232,232,1)] dark:bg-gray-700 dark:text-gray-100
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-indigo-500
                text-sm md:text-base"
                
                placeholder="Give your device a name (e.g., Field Rover 1)"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="deviceType"
                className="text-base md:text-lg font-medium"
              >
                Device Type
              </label>
              <select
                id="deviceType"
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value)}
                className="mt-1 w-full border border-gray-300 dark:border-gray-600 
                rounded-xl shadow-sm py-2 px-3 bg-[rgba(232,232,232,1)] dark:bg-gray-700 dark:text-gray-100
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-indigo-500
                text-sm md:text-base"
              >
                <option value="rover">Rover</option>
                <option value="base">Base Station</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600
                           text-sm md:text-base bg-white hover:bg-gray-900 hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-md text-sm md:text-base text-white
                           bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300
                           dark:bg-indigo-600 dark:hover:bg-indigo-500
                           focus:outline-none focus:ring-2 focus:ring-offset-2
                           focus:ring-blue-500 dark:focus:ring-indigo-500"
              >
                {isSubmitting ? "Registering..." : "Register Device"}
              </button>
            </div>
          </form>
        </div>

        {/* Help section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mt-4">
          <h3 className="text-base md:text-lg font-medium text-blue-800 dark:text-blue-400 mb-2">
            Need help?
          </h3>
          <p className="text-sm md:text-base text-blue-700 dark:text-blue-300 mb-4">
            If you're having trouble registering your device, please check the
            following:
          </p>
          <ul className="text-sm md:text-base list-disc pl-5 space-y-2 text-blue-700 dark:text-blue-300">
            <li>Make sure your device is powered on</li>
            <li>Verify that the device ID is entered correctly</li>
            <li>Ensure your device has been activated by the manufacturer</li>
            <li>
              Check that your device is not already registered to another
              account
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RegisterNewDevice;

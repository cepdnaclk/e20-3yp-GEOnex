import React, { useState, useEffect,useContext } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { ChevronDown } from "lucide-react";

import { toast } from "react-toastify";
import PageTopic from "../components/PageTopic";
import { useParams, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { Context } from "../context/Context";

const NewProject = () => {

  const { navigate, backendUrl, fetchProject } =
    useContext(Context);
    
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [baseStations, setBaseStations] = useState([]);
  const [clientDevices, setClientDevices] = useState([]);
  const [baseloading, setBaseLoading] = useState(true);
  const [clientloading, setClientLoading] = useState(true);
  const [selectedBaseStation, setSelectedBaseStation] = useState("");

  const { userId } = useParams();

  useEffect(() => {
    fetchAssignedBaseStations();
    fetchAssignedClientDevices();
  }, [userId]);

  const toggleBaseLoading = () => {
    setBaseLoading(!baseloading);
  };

  const toggleClientLoading = () => {
    setClientLoading(!clientloading);
  };

  const fetchAssignedBaseStations = async () => {
    try {
      const response = await axios.get(
        backendUrl + `/api/user/${userId}/devices/base-stations`
      );
      const baseStations = response.data.connectedDevices || [];
      if (baseStations.length > 0) {
        setBaseStations(baseStations);
        setBaseLoading(false);
        console.log(baseStations);
      } else {
        toast.error("No base stations assigned to this user.");
        setBaseStations([]);
      }
    } catch (error) {
      console.error("Error fetching assigned base stations:", error);
    }
  };

  const fetchAssignedClientDevices = async () => {
    try {
      const response = await axios.get(
        backendUrl+ `/api/user/${userId}/devices/client-devices`
      );
      const clientDevices = response.data.connectedDevices || [];
      if (clientDevices.length > 0) {
        setClientDevices(clientDevices);
      } else {
        toast.error("No client devices connected to this user.");
        setClientDevices([]);
      }
    } catch (error) {
      console.error("Error fetching client devices", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        Name: projectName,
        Description: description,
        BaseStation: selectedBaseStation,
        ClientDevices: Array.from(
          document.querySelectorAll('input[name="clientDevice"]:checked')
        ).map((checkbox) => checkbox.value),
        UserId: userId,
      };

      // POST to your create project endpoint
      const response = await axios.post(backendUrl + "/api/projects/", payload);
      console.log("Project created:", response.data);

      // Extract the newly created project ID from response data
      const newProjectId = response.data._id;
      if (newProjectId) {
        // Navigate to the survey page with the new project's id in the URL
        fetchProject(newProjectId);
        navigate(`/projects/pointsurvey/${newProjectId}`);

      } else {
        toast.error("Project created, but no project id returned.");
      }
    } catch (error) {
      toast.error(
        `Error creating project: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-gray-900 dark:text-gray-100">
      {/* Header Section */}
      <PageTopic
        topic="New Project"
        intro="Create a new project and start your survey"
      />

      {/* Form Section */}
      <div className="flex-1 p-4 max-w-3xl mx-4 pl-10">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          {/* Project Name */}
          <div className="mb-6">
            <label
              className="block text-sm md:text-base font-medium mb-2"
              htmlFor="projectName"
            >
              Project Name
            </label>
            <input
              id="projectName"
              type="text"
              className="w-full rounded-xl p-2 pl-5 text-sm md:text-base
              bg-[rgba(232,232,232,1)] dark:bg-gray-700 dark:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-black
              dark:focus:ring-indigo-500 "
              value={projectName}
              placeholder="Enter project name"
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>

          {/* Base Station Selection */}
          <div className="relative mb-6">
            <p className="text-sm md:text-base font-semibold mb-2">
              Select a Base Station
            </p>
            <select
              id="baseStation"
              className="w-full rounded-xl p-3 text-sm md:text-base appearance-none
              bg-[rgba(232,232,232,1)] dark:bg-gray-700 dark:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-indigo-500"
              value={selectedBaseStation}
              onChange={(e) => setSelectedBaseStation(e.target.value)}
            >
              <option value="" disabled>
                Select a base station
              </option>

              {baseStations.length === 0 && (
                <option value="" disabled>
                  No base stations available
                </option>
              )}
              {baseStations.map((station, index) => (
                <option key={index} value={station._id}>
                  {station.Name} - {station.DeviceCode}
                </option>
              ))}
            </select>

            <div className="absolute right-3 top-14 -translate-y-1/2 pointer-events-none">
              {baseloading ? (
                <LoadingSpinner
                  size={6}
                  className="animate-spin text-gray-500"
                />
              ) : (
                <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
              )}
            </div>
          </div>

          {/* Client Devices */}
          <div className="mb-6 relative">
            <p className="text-sm md:text-base font-semibold mb-2">
              Available Client Devices
            </p>
            <div
              className="flex flex-col gap-2 p-3 rounded-xl
              bg-[rgba(232,232,232,1)] dark:bg-gray-700"
              
            >
              {!clientDevices || clientDevices.length === 0 ? (
                <p className="text-sm text-gray-800 dark:text-gray-300">
                  No client devices available
                </p>
              ) : (
                clientDevices.map((device, index) => (
                  <label
                    key={index}
                    className="flex items-center gap-2 text-sm md:text-base"
                  >
                    <input
                      type="checkbox"
                      name="clientDevice"
                      value={device._id}
                      className="accent-blue-600 dark:accent-indigo-500"
                    />
                    <span className="flex-1">
                      {device.Name}
                      <span className="ml-auto pl-2 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                        {device.DeviceCode}
                      </span>
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label
              className="block text-sm md:text-base font-semibold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              className="w-full h-32 rounded-xl p-3 text-sm md:text-base
              bg-[rgba(232,232,232,1)] dark:bg-gray-700 dark:text-gray-100 
              focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-indigo-500"
              placeholder="Short description of the project"
              
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Start Survey Button */}
          <button
            className="w-full bg-black text-white py-3 rounded-xl text-sm md:text-base 
            font-semibold mt-4 hover:bg-gray-900 dark:bg-indigo-600 dark:hover:bg-indigo-500 "
            onClick={handleSubmit}
          >
            Start Survey
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewProject;

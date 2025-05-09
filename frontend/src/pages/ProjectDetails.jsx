import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import { Context } from "../context/Context";
import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import relativeTime from "dayjs/plugin/relativeTime";

// Extend dayjs with relativeTime
dayjs.extend(relativeTime);

const ProjectDetails = () => {
  const { navigate, backendUrl, removeProject } = useContext(Context);
  const { projectId } = useParams();
  const [project, setProject] = useState(null);

  const handleDelete = async () => {
    await removeProject(projectId);
    navigate("/projects");  
  };

  useEffect(() => {
    // Fetch project details from backend using projectId from the URL.
    const fetchProject = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/projects/${projectId}`
        );
        if (response.data.success) {
          setProject(response.data.project);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };
    fetchProject();
  }, [projectId]);

  if (!project) return <div>Loading...</div>;

  return (
    <div>
      <div className="grid grid-cols-1  
      md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-7
      gap-4 lg:h-screen">

        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex items-center gap-3">
          {/* Left arrow button */}
          <button
            className="text-2xl"
            onClick={() => {
              navigate("/projects");
            }}
          >
            <img className="w-6 h-6 md:w-8 md:h-8" src={assets.arrow} alt="goback" />
          </button>

          {/* Title & subtitle */}
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold">{project.Name}</h1>
            <p className="text-sm md:text-base lg:text-lg mt-1">{project.Description}</p>
          </div>
        </div>

        {/* Actions Section (Left) */}
        <div className="col-span-1 lg:row-span-6 bg-white p-4 rounded-lg flex flex-col gap-4 overflow-auto">
          <h2 className="text-base md:text-lg font-semibold">Actions</h2>
          <div
            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer"
            style={{ backgroundColor: "rgba(217, 217, 217, 1)" }}
            onClick={() => {
              navigate(`/pointsurvey/${projectId}`);
            }}
          >
            <img className="w-6 h-6 md:w-8 md:h-8" src={assets.map} alt="View on Map" />
            <div>
              <h3 className="font-semibold text-sm md:text-base">View on Map</h3>
              <p className="text-xs md:text-sm text-gray-600">
                See map and continue surveying
              </p>
            </div>
          </div>

          {/* Points */}
          <div
            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer"
            style={{ backgroundColor: "rgba(217, 217, 217, 1)" }}
            onClick={() => {
              navigate(`/takenpoints/${projectId}`);
            }}
          >
            <img className="w-6 h-6 md:w-8 md:h-8" src={assets.points} alt="Points" />
            <div>
              <h3 className="font-semibold text-sm md:text-base">Points</h3>
              <p className="text-xs md:text-sm text-gray-600">
                See taken points, edit and delete
              </p>
            </div>
          </div>

          {/* Export Data */}
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: "rgba(217, 217, 217, 1)" }}
          >
            <div className="flex items-center gap-3 mb-2">
              <img
                className="w-6 h-6 md:w-8 md:h-8"
                src={assets.export_data}
                alt="Export Data"
              />
              <div>
                <h3 className="font-semibold text-sm md:text-base">Export Data</h3>
                <p className="text-xs md:text-sm text-gray-600">Select export format</p>
              </div>
            </div>
            <select className="w-full mb-2 p-2 rounded border border-gray-300 text-sm md:text-base">
              <option value="dwg">dwg</option>
              <option value="png">png</option>
              <option value="pdf">pdf</option>
              <option value="jpeg">jpeg</option>
            </select>
            <button className="bg-black text-white px-8 py-1.5 rounded-xl text-sm md:text-base">
              Export
            </button>
          </div>

          {/* Delete Project */}
          <div
            className="flex items-center gap-3 p-3 rounded-lg bg-red-500 cursor-pointer"
            onClick={handleDelete}
          >
            <img className="w-6 h-6 md:w-8 md:h-8" src={assets.bin} alt="delete" />
            <div>
              <h3 className="font-semibold text-white text-sm md:text-base">Delete Project</h3>
              <p className="text-xs md:text-sm text-white">This action cannot be undone</p>
            </div>
          </div>
        </div>

        {/* Overview Section (Right) */}
        <div className="col-span-1 row-span-3 bg-white p-4 rounded-lg flex flex-col gap-3">
          <h2 className="text-base md:text-lg font-semibold">Overview</h2>

          <div className="flex justify-between items-center">
            <span className="font-semibold text-sm md:text-base">Created On</span>
            <span
              className="px-3 py-1 rounded-xl text-xs md:text-sm w-32 text-center"
              style={{ backgroundColor: "rgba(232, 232, 232, 1)" }}
            >
              {dayjs(project.Created_On).format("MMM D, YYYY")}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold text-sm md:text-base">Last Modified</span>
            <span
              className="px-3 py-1 rounded-xl text-xs md:text-sm w-32 text-center"
              style={{ backgroundColor: "rgba(232, 232, 232, 1)" }}
            >
              {dayjs(project.Last_Modified).fromNow()}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold text-sm md:text-base">Status</span>
            <span className="bg-blue-600 text-white px-3 py-1 rounded-xl text-xs md:text-sm w-32 text-center">
              {project.Status}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold text-sm md:text-base">Number of Points</span>
            <span
              className="px-3 py-1 rounded-xl text-xs md:text-sm w-32 text-center"
              style={{ backgroundColor: "rgba(232, 232, 232, 1)" }}
            >
              {/* {project.Total_Points || 0} */}
              2
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold text-sm md:text-base">Survey Time</span>
            <span
              className="px-3 py-1 rounded-xl text-xs md:text-sm w-32 text-center"
              style={{ backgroundColor: "rgba(232, 232, 232, 1)" }}
            >
              {project.Survey_Time || "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;

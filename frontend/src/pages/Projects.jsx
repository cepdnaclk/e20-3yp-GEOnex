import React, { useContext, useEffect } from "react";
import { Context } from "../context/Context";
import dayjs from "dayjs";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const Projects = () => {
  const { navigate, projects, getProjectsData, removeProject } =
    useContext(Context);

  useEffect(() => {
    getProjectsData();
  }, [getProjectsData]);

  return (
    <div>
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4
        md:grid-rows-[80px_auto]"
      >
        <div
          className="col-span-1 md:col-span-2 lg:col-span-4 
         flex items-center justify-between"
        >
          {/* Left side: Title & Subtitle */}
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semi-bold">
              Projects
            </h1>
            <p className="text-sm md:text-base lg:text-lg mt-1">
              Manage your all projects
            </p>
          </div>

          {/* Right side: "Add New Project" Button */}
          <button
            className="flex text-sm md:text-lg lg:text-xl
            items-center gap-1 text-s px-4 py-2 bg-black text-white rounded-lg"
            onClick={() => {
              navigate("/newproject");
            }}
          >
            <span>+</span>
            Add New Project
          </button>
        </div>

        <div
          className="col-span-1 md:col-span-2 lg:col-span-3
          bg-white p-4 rounded-lg"
        >
          <div className="bg-white p-4 rounded-lg">
            <div className="overflow-x-auto">
              <table
                className="w-full text-sm text-left border-separate border-spacing-y-2"
                style={{ borderCollapse: "separate" }}
              >
                <thead className="text-xs md:text-sm lg:text-base text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Project
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Created On
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Last Modified
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project, index) => {
                    // Declare variables here
                    const createdOn = dayjs(project.Created_On).format(
                      "MMM D, YYYY"
                    );
                    const lastModified = dayjs(project.Last_Modified).format(
                      "MMM D, YYYY"
                    );

                    return (
                      <tr
                        key={index}
                        style={{ backgroundColor: "rgba(197,197,198,1)" }}
                        onClick={() => navigate(`/project/${project._id}`)}
                        className="cursor-pointer text-xs md:text-sm lg:text-base"
                      >
                        <td className="px-6 py-4 rounded-l-lg">
                          {project.Name}
                        </td>
                        <td className="px-6 py-4">{createdOn}</td>
                        <td className="px-6 py-4">{lastModified}</td>

                        <td className="px-6 py-4 rounded-r-lg">
                          <div className="flex items-center justify-between">
                            <span
                              className={`px-1 py-1 text-xs md:text-sm lg:text-base font-semibold ${
                                project.Status === "Active"
                                  ? "text-blue-700"
                                  : project.Status === "Pending"
                                  ? "text-orange-500"
                                  : "text-green-700"
                              }`}
                            >
                              {project.Status}
                            </span>
                            <img
                              src={assets.bin}
                              alt="Delete Project"
                              className="w-3 h-3       
                                      sm:w-4 sm:h-4 
                                      md:w-5 md:h-5
                                      cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeProject(project._id);
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;

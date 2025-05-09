import React, { useContext, useEffect } from "react";
import { Context } from "../context/Context";
import dayjs from "dayjs";

const RecentProjects = () => {
  const { navigate, projects, getProjectsData } = useContext(Context);

  useEffect(() => {
    getProjectsData();
  }, [getProjectsData]);

  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.Last_Modified) - new Date(a.Last_Modified))
    .slice(0, 4);

  return (
    <div className="bg-white p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold">Recent Projects</h2>
        <button
          className="text-sm md:text-base lg:text-lg px-4 py-2"
          style={{ color: "blue" }}
          onClick={() => {
            navigate("/projects");
          }}
        >
          View All
        </button>
      </div>
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
            {recentProjects.map((project, index) => {
              // Declare variables here
              const createdOn = dayjs(project.Created_On).format("MMM D, YYYY");
              const lastModified = dayjs(project.Last_Modified).format(
                "MMM D, YYYY"
              );

              // Return JSX
              return (
                <tr
                  key={index}
                  style={{ backgroundColor: "rgba(197,197,198,1)" }}
                  onClick={() => navigate(`/project/${project._id}`)}
                  className="cursor-pointer text-xs md:text-sm lg:text-base"
                >
                  <td className="px-6 py-4 rounded-l-lg">{project.Name}</td>
                  <td className="px-6 py-4">{createdOn}</td>
                  <td className="px-6 py-4">{lastModified}</td>

                  <td className="px-6 py-4 rounded-r-lg">
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentProjects;

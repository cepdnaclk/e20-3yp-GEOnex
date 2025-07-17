import React, { useContext, useEffect } from "react";
import { Context } from "../context/Context";
import dayjs from "dayjs";


const RecentProjects = () => {
  const { navigate, projects, getProjectsData,userData } = useContext(Context);


  const userId = userData.userId; 
  
  useEffect(() => {
    console.log(userId);
    getProjectsData(userId);
  }, [userId]);

  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.Last_Modified) - new Date(a.Last_Modified))
    .slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-800 dark:text-gray-100 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold">Recent Projects</h2>
        

        <button
            className="text-sm md:text-base lg:text-lg px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors
            dark:text-indigo-400 dark:hover:text-indigo-300 dark:hover:bg-indigo-900/20"
            onClick={() => navigate("/projects")}
          >
            View All
          </button>
      </div>
      <div className="overflow-x-auto">
        <table
          className="w-full text-sm text-left border-separate border-spacing-y-2"
          style={{ borderCollapse: "separate" }}
        >
          <thead className=" uppercase bg-gray-50 dark:bg-gray-700">
            <tr className="text-xs md:text-sm lg:text-base text-gray-700 dark:text-gray-200">
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
                  onClick={() => navigate(`/projects/${project._id}`)}
                  className="cursor-pointer text-xs md:text-sm lg:text-base 
                  bg-[rgba(197,197,198,1)]  hover:bg-[rgba(180,180,180,1)] 
                  transition-colors duration-200 rounded-lg shadow-sm
                  dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  <td className="px-6 py-4 rounded-l-lg">{project.Name}</td>
                  <td className="px-6 py-4">{createdOn}</td>
                  <td className="px-6 py-4">{lastModified}</td>

                  <td className="px-6 py-4 rounded-r-lg">
                    <span
                      className={`px-1 py-1 text-xs md:text-sm lg:text-base font-medium ` }
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

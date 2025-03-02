import React from "react";

const projects = [
  { name: "Road Layout Survey", createdOn: "Jan 15, 2025", lastModified: "Feb 10, 2025", status: "In Progress" },
  { name: "Building Site Mapping", createdOn: "Jan 15, 2025", lastModified: "Feb 10, 2025", status: "Completed" },
  { name: "Farm Land Measurement", createdOn: "Jan 15, 2025", lastModified: "Feb 10, 2025", status: "Completed" },
  { name: "Farm Land Measurement", createdOn: "Jan 15, 2025", lastModified: "Feb 10, 2025", status: "Pending" },
  { name: "Farm Land Measurement", createdOn: "Jan 15, 2025", lastModified: "Feb 10, 2025", status: "Completed" },
  { name: "Farm Land Measurement", createdOn: "Jan 15, 2025", lastModified: "Feb 10, 2025", status: "Completed" },
  { name: "Farm Land Measurement", createdOn: "Jan 15, 2025", lastModified: "Feb 10, 2025", status: "Completed" },
  { name: "Farm Land Measurement", createdOn: "Jan 15, 2025", lastModified: "Feb 10, 2025", status: "Completed" },
];
      
      {/* Main Content */}
      <div className="flex-1 p-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Projects</h2>
          <button className="bg-black text-white px-4 py-2 rounded shadow hover:bg-gray-800">+ Add New Project</button>
        </div>
        <div className="bg-white p-6 rounded shadow-md">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-200">
                <th className="p-3">Project</th>
                <th className="p-3">Created On</th>
                <th className="p-3">Last Modified</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3">{project.name}</td>
                  <td className="p-3">{project.createdOn}</td>
                  <td className="p-3">{project.lastModified}</td>
                  <td className={`p-3 font-semibold ${getStatusStyle(project.status)}`}>{project.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-center text-gray-500 mt-4">That's all!</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;

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

const getStatusStyle = (status) => {
  switch (status) {
    case "In Progress": return "text-blue-500 bg-blue-100 px-2 py-1 rounded";
    case "Pending": return "text-orange-500 bg-orange-100 px-2 py-1 rounded";
    case "Completed": return "text-gray-500 bg-gray-200 px-2 py-1 rounded";
    default: return "";
  }
};

const ProjectsPage = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">GEO<span className="text-gray-500">nex</span></h1>
          <nav className="mt-6 space-y-4">
            <a href="#" className="flex items-center space-x-2 text-gray-700 hover:text-black"><span>🏠</span> Home</a>
            <a href="#" className="flex items-center space-x-2 text-gray-700 hover:text-black"><span>📍</span> Devices</a>
            <a href="#" className="flex items-center space-x-2 font-bold text-black"><span>📖</span> Projects</a>
            <a href="#" className="flex items-center space-x-2 text-gray-700 hover:text-black"><span>⚙️</span> Settings</a>
          </nav>
        </div>
        <button className="text-red-600 border border-red-600 p-2 rounded w-full hover:bg-red-600 hover:text-white">Log out</button>
      </div>
      
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

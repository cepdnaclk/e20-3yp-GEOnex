import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import { Context } from "../context/Context";
import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import relativeTime from "dayjs/plugin/relativeTime";
import PageTopic from "../components/PageTopic";
import LoadingSpinner from "../components/LoadingSpinner";
import PositioningMode from "../components/PositioningMode";
import ProjectOverview from "../components/ProjectOverview";
import SectionsOverview from "../components/SectionsOverview";

// Extend dayjs with relativeTime
dayjs.extend(relativeTime);

const ProjectDetails = () => {
  const { navigate, backendUrl, removeProject, fetchProject,project, setProject, updateProjectSections, removeProjectSection} = useContext(Context);
  const { projectId } = useParams();
  

  const [exportFormat, setExportFormat] = useState("pdf");
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState(null);

  

  
  const handleDelete = async () => {
    const ok = window.confirm(
      `Delete project “${project.Name}”?\nThis action cannot be undone.`
    );

    if (!ok) return;

    await removeProject(projectId);
    navigate(-1); // Go back
  };

  

  useEffect(() => {
    fetchProject(projectId);
  }, [projectId]);

  // Handle export format selection
  const handleFormatChange = (e) => {
    setExportFormat(e.target.value);
    setExportStatus(null);
  };

const handleExport = async () => {
  try {
    setIsExporting(true);
    setExportStatus({ type: 'info', message: `Preparing ${exportFormat?.toUpperCase()} file...` });

    const response = await fetch(`${backendUrl}/api/export/${exportFormat}/${projectId}`, {
      method: 'GET',
    });

    console.log("Export response:", response);

    if (!response.ok) {
      throw new Error(`Failed to export: ${response.status} ${response.statusText}`);
    }

    // Get file blob
    const blob = await response.blob();

    // Extract filename from Content-Disposition header
    const contentDisposition = response.headers.get("Content-Disposition");
    let filename = `project-points.${exportFormat?.toLowerCase() || 'txt'}`;

    if (contentDisposition) {
      const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (match && match[1]) {
        filename = decodeURIComponent(match[1].replace(/['"]/g, '').trim());
      }
    }

    // Create a temporary download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    setExportStatus({ type: 'success', message: `Successfully exported as ${exportFormat.toUpperCase()}` });

  } catch (error) {
    console.error("Export failed:", error);
    setExportStatus({ type: 'error', message: `Export failed: ${error.message}` });
  } finally {
    setIsExporting(false);
  }
};




  if (!project) return <div><LoadingSpinner size={10}/></div>;

  return (
    <div>
      <PageTopic topic={project.Name}  intro={project.Description} />
      <div className="flex flex-col lg:flex-row gap-4 lg:ml-14 p-4">



      <div className="flex flex-col gap-2">
         {/* Actions Section (Left) */}
        <div className="h-max bg-white p-5 rounded-lg flex flex-col gap-3 overflow-auto">
          <h2 className="text-base md:text-lg font-semibold pb-5">Actions</h2>
          <div
            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer"
            style={{ backgroundColor: "rgba(232, 232, 232, 1)" }}
            onClick={() => {
              navigate(`/projects/pointsurvey/${projectId}`);
            }}
          >
            <img
              className="w-6 h-6 md:w-8 md:h-8"
              src={assets.map}
              alt="View on Map"
            />
            <div>
              <h3 className="font-semibold text-sm md:text-base">
                View on Map
              </h3>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                See map and continue surveying
              </p>
            </div>
          </div>

          {/* Points */}
          <div
            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer"
            style={{ backgroundColor: "rgba(232, 232, 232, 1)" }}
            onClick={() => {
              navigate(`/projects/takenpoints/${projectId}`);
            }}
          >
            <img
              className="w-6 h-6 md:w-8 md:h-8"
              src={assets.points}
              alt="Points"
            />
            <div>
              <h3 className="font-semibold text-sm md:text-base">Points</h3>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                See taken points, edit and delete
              </p>
            </div>
          </div>

          {/* Export Data */}
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: "rgba(232, 232, 232, 1)" }}
          >
            <div className="flex items-center gap-3 mb-2">
              <img
                className="w-6 h-6 md:w-8 md:h-8"
                src={assets.export_data}
                alt="Export Data"
              />
              <div>
                <h3 className="font-semibold text-sm md:text-base">
                  Export Data
                </h3>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  Select export format
                </p>
              </div>
            </div>
            <select
              className="w-full mb-2 p-2 rounded text-sm md:text-base
              border border-gray-300 dark:border-gray-600
              bg-gray-50 dark:bg-gray-800 dark:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-black
              dark:focus:ring-indigo-500"
              value={exportFormat}
              onChange={handleFormatChange}
            >
              <option value="pdf">PDF Report</option>
               <option value="dxf">DXF (AutoCAD)</option>
              <option value="csv">CSV</option>
              <option value="txt">TXT</option>
            </select>
            <button
              className="bg-black hover:bg-gray-900 text-white px-8 py-1.5 rounded-xl text-sm md:text-base
              disabled:bg-gray-400 dark:bg-indigo-600 dark:hover:bg-indigo-500"
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Exporting...
                </>
              ) : (
                "Export"
              )}
            </button>
            {exportStatus && (
              <div
                className={`mt-2 p-2 text-sm rounded ${
                  exportStatus.type === "success"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : exportStatus.type === "error"
                    ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                }`}
              >
                {exportStatus.message}
              </div>
            )}
          </div>

          {/* Delete Project */}
          <div
            className="flex items-center gap-3 p-3 rounded-lg bg-red-500 cursor-pointer
            dark:bg-red-600 dark:hover:bg-red-700 "
            onClick={handleDelete}
          >
            <img
              className="w-6 h-6 md:w-8 md:h-8"
              src={assets.bin}
              alt="delete"
            />
            <div>
              <h3 className="font-semibold text-white text-sm md:text-base">
                Delete Project
              </h3>
              <p className="text-xs md:text-sm text-white">
                This action cannot be undone
              </p>
            </div>
          </div>
        </div>



        {/* assigned Configs */}
        
        <PositioningMode />
      </div>

      <div className="flex flex-col gap-4 max-w-2xl  ">
         {/* Overview Section (Right) */}
        <ProjectOverview/>

        {/* /* assigned survayers */} 

          <div className=" bg-white p-5 rounded-lg flex flex-col gap-2 h-max ">
            <h2 className="text-base md:text-lg font-semibold pb-2">Surveyers</h2>

            {/* Sections Manage */}
          </div>
         <SectionsOverview/>

      </div>
      </div>
      
    </div>
  );
};

export default ProjectDetails;

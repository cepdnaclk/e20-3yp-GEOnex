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

// Extend dayjs with relativeTime
dayjs.extend(relativeTime);

const ProjectDetails = () => {
  const { navigate, backendUrl, removeProject, fetchProject,project, setProject, updateProjectSections, removeProjectSection} = useContext(Context);
  const { projectId } = useParams();
  

  const [exportFormat, setExportFormat] = useState("dwg");
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState(null);

  const [newSection, setNewSection] = useState("");

  const handleAddSection = () => {
    const trimmed = newSection.trim();
    if (trimmed === "") return;

    if (project.Sections.includes(trimmed)) {
      toast.error("Section already exists");
    } else {
      setProject({
        ...project,
        Sections: [...project.Sections, trimmed],
      });
      updateProjectSections(projectId, [...project.Sections, trimmed]);
      setNewSection("");
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm(
      `Delete project “${project.Name}”?\nThis action cannot be undone.`
    );

    if (!ok) return;

    await removeProject(projectId);
    navigate(-1); // Go back
  };

  const removeSection = async (projectId, section) => {
    try {

      await removeProjectSection(projectId, section);

      if (response.data.success) {  
        toast.success("Section removed successfully");
      } else {
        toast.error("Failed to remove section");
      }
    } catch (error) {
      console.error("Error removing section:", error);
    }
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
    setExportStatus({ type: 'info', message: `Preparing ${exportFormat} file...` });

    // Call backend to export file (adjust URL based on format and project ID)
    const response = await fetch(`${backendUrl}/api/export/${exportFormat}/${projectId}`, {
      method: 'GET',
    });

    console.log("Export response:", response);

    if (!response.ok) {
      throw new Error(`Failed to export: ${response.statusText}`);
    }

    // Get file blob and suggested filename
    const blob = await response.blob();
    const contentDisposition = response.headers.get("Content-Disposition");
    let filename = `project-points.${exportFormat}`;

    if (contentDisposition && contentDisposition.includes("filename=")) {
      filename = contentDisposition
        .split("filename=")[1]
        .replaceAll('"', '')
        .trim();
    }

    // Create a download link and trigger download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    setExportStatus({ type: 'success', message: `Successfully exported as ${exportFormat}` });
  } catch (error) {
    console.error("Export failed:", error);
    setExportStatus({ type: 'error', message: `Failed to export as ${exportFormat}` });
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
               <option value="dxf">DXF (AutoCAD)</option>
              <option value="png">PNG Image</option>
              <option value="pdf">PDF Document</option>
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



        {/* assigned devices */}

        <div className=" bg-white p-5 rounded-lg flex flex-col gap-2 h-max ">
          <h2 className="text-base md:text-lg font-semibold pb-2">Devices</h2>

          
        </div>

      </div>

      <div className="flex flex-col gap-4">
         {/* Overview Section (Right) */}
        <div className=" bg-white p-5 rounded-lg flex flex-col gap-3 h-max ">
          <h2 className="text-base md:text-lg font-semibold pb-2">Overview</h2>

          <div className="flex justify-between items-center">
            <span className="font-semibold text-sm md:text-base">
              Created On
            </span>
            <span
              className=" px-3 py-1 rounded-xl text-xs md:text-sm w-32 text-center
              bg-[rgba(232,232,232,1)] dark:bg-gray-700 dark:text-gray-100 "
            >
              {dayjs(project.Created_On).format("MMM D, YYYY")}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold text-sm md:text-base">
              Last Modified
            </span>
            <span
              className="px-3 py-1 rounded-xl text-xs md:text-sm w-32 text-center
              bg-[rgba(232,232,232,1)] dark:bg-gray-700 dark:text-gray-100"
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
            <span className="font-semibold text-sm md:text-base">
              Number of Points
            </span>
            <span
              className="px-3 py-1 rounded-xl text-xs md:text-sm w-32 text-center
              bg-[rgba(232,232,232,1)] dark:bg-gray-700 dark:text-gray-100"
            >
              {project.Total_Points || 0}
            </span>
          </div>


          <div className="flex justify-between items-center">
            <span className="font-semibold text-sm md:text-base">
              Survey Time
            </span>
            <span
              className="px-3 py-1 rounded-xl text-xs md:text-sm w-32 text-center
              bg-[rgba(232,232,232,1)] dark:bg-gray-700 dark:text-gray-100"
            >
              {project.Survey_Time || "N/A"}
            </span>
          </div>
        </div>


        {/* /* assigned survayers */} 

          <div className=" bg-white p-5 rounded-lg flex flex-col gap-2 h-max ">
            <h2 className="text-base md:text-lg font-semibold pb-2">Surveyers</h2>

            {/* Sections Manage */}
          </div>
         <div className="bg-white p-5 rounded-lg flex flex-col gap-2 h-max">
              <h2 className="text-base md:text-lg font-semibold pb-2">Sections</h2>

              <div className="flex flex-wrap gap-2">
          {project.Sections && project.Sections.length > 0 ? (
            project.Sections.map((section, idx) => (
              <span
                key={idx}
                className="flex items-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-3 py-1 rounded-full text-xs md:text-sm"
              >
                {section}
                {section !== "default" && (
  <button
    className="ml-2 text-gray-900 hover:text-red-500 focus:outline-none text-lg"
    title="Remove section"
    onClick={() => {
      const updatedSections = project.Sections.filter((_, i) => i !== idx);
      setProject({
        ...project,
        Sections: updatedSections,
      });
      const removedSection = project.Sections[idx];
      removeSection(projectId, removedSection);
    }}
  >
    &times;
  </button>
)}

              </span>
            ))
          ) : (
            <span className="text-gray-500">No sections available</span>
          )}
              </div>

              {/* Input + Button to add new section */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Add new section"
          className="flex-1 p-2 border rounded-lg text-sm md:text-base"
          style={{ backgroundColor: "rgba(232, 232, 232, 1)" }}
          value={newSection}
          onChange={(e) => setNewSection(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddSection();
          }}
        />
        <button
          className="bg-black hover:bg-gray-900 text-white px-8 py-1.5 rounded-xl text-sm md:text-base
              disabled:bg-gray-400 dark:bg-indigo-600 dark:hover:bg-indigo-500"
          onClick={handleAddSection}
        >
          Add
        </button>
      </div>
    </div>


      </div>
       
           

       
        
        
      </div>
      
    </div>
  );
};

export default ProjectDetails;

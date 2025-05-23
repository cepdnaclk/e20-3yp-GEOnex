import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import { Context } from "../context/Context";
import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import relativeTime from "dayjs/plugin/relativeTime";
import PageTopic from "../components/PageTopic";

// Extend dayjs with relativeTime
dayjs.extend(relativeTime);

const ProjectDetails = () => {
  const { navigate, backendUrl, removeProject } = useContext(Context);
  const { projectId } = useParams();
  const [project, setProject] = useState(null);


  const [exportFormat, setExportFormat] = useState('dwg');
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState(null);


  const handleDelete = async () => {
    await removeProject(projectId);
    navigate(-1);  // Go back
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

  // Handle export format selection
  const handleFormatChange = (e) => {
    setExportFormat(e.target.value);
    setExportStatus(null);
  };



  // Helper function to convert points data to desired formats
  const convertPointsData = (format) => {
    // This is a placeholder - actual conversion would depend on your data structure
    // and specific format requirements
    
    switch (format) {
      case 'dwg':
        // In a real app, you'd use a library like three.js with DXF export
        // or call a backend service for DWG conversion
        return new Blob([JSON.stringify(pointsData)], { type: 'application/octet-stream' });
      
      case 'png':
      case 'jpeg':
        // For image formats, typically you'd render the points to a canvas
        // and then export the canvas as an image
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');
        
        // Draw points on canvas (simplified example)
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 1;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (pointsData && pointsData.length) {
          pointsData.forEach(point => {
            // Scale points to fit canvas
            const x = (point.x / 100) * canvas.width;
            const y = (point.y / 100) * canvas.height;
            
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
            ctx.fill();
          });
        }
        
        // Return the canvas data as requested format
        return new Promise(resolve => {
          canvas.toBlob(blob => {
            resolve(blob);
          }, format === 'png' ? 'image/png' : 'image/jpeg', 0.95);
        });
      
      case 'pdf':
        // In a real app, you'd use a library like jsPDF
        // This is just a placeholder
        return new Blob([JSON.stringify(pointsData)], { type: 'application/pdf' });
      
      case 'txt':
        // Format points as plain text
        let textContent = "X,Y,Z Coordinates\n";
        if (pointsData && pointsData.length) {
          pointsData.forEach(point => {
            textContent += `${point.x},${point.y},${point.z || 0}\n`;
          });
        }
        return new Blob([textContent], { type: 'text/plain' });
      
      default:
        return null;
    }
  };

// Handle the export button click
  const handleExport = async () => {
    try {
      setIsExporting(true);
      setExportStatus({ type: 'info', message: `Preparing ${exportFormat} file...` });
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Convert data to the selected format
      const blob = await convertPointsData(exportFormat);
      
      if (!blob) {
        throw new Error('Failed to convert data');
      }
      
      // Create a download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `project-points.${exportFormat}`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setExportStatus({ type: 'success', message: `Successfully exported as ${exportFormat}` });
    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus({ type: 'error', message: `Failed to export as ${exportFormat}` });
    } finally {
      setIsExporting(false);
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div>
      <PageTopic topic={project.Name}  intro={project.Description} />
      <div className="grid grid-cols-1  
      md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-7
      gap-4 lg:h-screen lg:ml-14">

       

        {/* Actions Section (Left) */}
        <div className="h-max bg-white p-5 rounded-lg flex flex-col gap-3 overflow-auto">
          <h2 className="text-base md:text-lg font-semibold pb-5">Actions</h2>
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
            <select className="w-full mb-2 p-2 rounded border border-gray-300 text-sm md:text-base"
            value={exportFormat}
        onChange={handleFormatChange}
            >
               <option value="dwg">DWG (AutoCAD)</option>
              <option value="png">PNG Image</option>
              <option value="pdf">PDF Document</option>
              <option value="jpeg">JPEG Image</option>
              <option value="txt">TXT (Comma-separated)</option>
            </select>
            <button className="bg-black text-white px-8 py-1.5 rounded-xl text-sm md:text-base"
            onClick={handleExport}
            disabled= {isExporting}

            >
              {isExporting ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Exporting...
          </>
        ) : (
          'Export'
        )}
            </button>
            {exportStatus && (
        <div className={`mt-2 p-2 text-sm rounded ${
          exportStatus.type === 'success' ? 'bg-green-100 text-green-800' : 
          exportStatus.type === 'error' ? 'bg-red-100 text-red-800' : 
          'bg-blue-100 text-blue-800'
        }`}>
          {exportStatus.message}
        </div>
      )}
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
        <div className=" bg-white p-5 rounded-lg flex flex-col gap-5 h-max ">
          <h2 className="text-base md:text-lg font-semibold pb-5">Overview</h2>

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
              {project.Total_Points || 0}
              
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

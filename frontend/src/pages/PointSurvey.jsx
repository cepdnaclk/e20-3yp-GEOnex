import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { Context } from "../context/Context";
import MapSection from "../components/MapSection";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import SensorData from "../components/SensorData";
import PageTopic from "../components/PageTopic";

const PointSurvey = () => {
  const { navigate, backendUrl } = useContext(Context);
  const { projectId } = useParams();
  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    // Fetch project name
    const fetchName = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/projects/${projectId}`
        );
        if (response.data.success) {
          setProjectName(response.data.project.Name);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };
    fetchName();
  }, [projectId]);

  return (
    <div className="text-gray-900 dark:text-gray-100">
      <div
        className="grid grid-cols-1 gap-0
       md:grid-cols-2 md:grid-rows-7 md:h-screen "
      >
        {/* Header row with left group and right button */}
        <div className="col-span-1 md:col-span-2">
          {/* Left group: arrow and title */}

          <PageTopic
            topic={projectName || "Loading..."}
            intro="Feel free to do surveys"
            right={
              <button
                className="flex items-center gap-1 text-xs md:text-base lg:text-lg
             px-3 md:px-10 py-2 bg-black hover:bg-gray-800 text-white 
             rounded-xl dark:bg-indigo-600 dark:hover:bg-indigo-500 "
                onClick={() => {
                  navigate(`/projects/takenpoints/${projectId}`);
                }}
              >
                Proceed <span>→</span>
              </button>
            }
          />
        </div>
        <div
          className="col-span-1 md:col-span-2 
        h-[80vh] 
        md:row-span-6 md:h-auto 
        bg-white rounded-lg
        flex flex-col overflow-auto
        -mx-6
        "
        >
          <MapSection />
        </div>

        {/* <SensorData/> */}
      </div>
    </div>
  );
};

export default PointSurvey;

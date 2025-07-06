import React, { useContext, useMemo, useEffect } from "react";
import { assets } from "../assets/assets";
import RecentProjects from "../components/RecentProjects";
import { Context } from "../context/Context";
import DashboardNotifications from "../components/DashboardNotifications";
import SectionHeader from "../components/SectionHeader";

const Dashboard = () => {
  const { navigate, userData, rovers, base, fetchUserDevices, backendUrl } =
    useContext(Context);

  // Use a constant or get this from context instead of hardcoding
  const userId = userData.userId;

  // Memoize the RecentProjects component to prevent unnecessary re-renders
  const memoizedRecentProjects = useMemo(() => {
    return <RecentProjects />;
  }, [userId]); // Only re-render if userId changes

  //   useEffect(() => {
  //   if ("Notification" in window && Notification.permission === "default") {
  //     Notification.requestPermission();
  //   }
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUserDevices();
      } catch (error) {
        console.error("Error fetching user devices:", error);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div className="text-gray-900 dark:text-gray-100">
      <SectionHeader
        title={`Hello ${userData?.name ?? "User"}`}
        subtitle="Welcome to Site Measurement IoT"
        right={
          <button
            className="flex items-center justify-center md:mt-4 mt-2 gap-2 px-4 py-2 bg-black  hover:bg-gray-800  
                      text-white rounded-lg text-sm md:text-lg lg:text-xl
                      dark:bg-indigo-600 dark:hover:bg-indigo-500"
            onClick={() => {
              navigate(`/projects/${userId}/newproject`);
            }}
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6 lg:w-6 lg:h-6 flex-shrink-0"
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 8v8M8 12h8"></path>
            </svg>

            <span className="hidden sm:inline">Add New Project</span>
          </button>
        }
      />

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4
        md:grid-rows-[100px_auto]"
      >
        <div
          className="col-span-1 bg-white rounded-lg flex gap-2 p-2 truncate 
        justify-start items-center dark:bg-gray-700"
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 1024 1024"
            height="4em"
            width="4em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M791.9 492l-37.8-10-13.8-36.5c-8.6-22.7-20.6-44.1-35.7-63.4a245.73 245.73 0 0 0-52.4-49.9c-41.1-28.9-89.5-44.2-140-44.2s-98.9 15.3-140 44.2a245.6 245.6 0 0 0-52.4 49.9 240.47 240.47 0 0 0-35.7 63.4l-13.9 36.6-37.9 9.9a125.7 125.7 0 0 0-66.1 43.7A123.1 123.1 0 0 0 140 612c0 33.1 12.9 64.3 36.3 87.7 23.4 23.4 54.5 36.3 87.6 36.3h496.2c33.1 0 64.2-12.9 87.6-36.3A123.3 123.3 0 0 0 884 612c0-56.2-37.8-105.5-92.1-120z"></path>
            <path d="M811.4 418.7C765.6 297.9 648.9 212 512.2 212S258.8 297.8 213 418.6C127.3 441.1 64 519.1 64 612c0 110.5 89.5 200 199.9 200h496.2C870.5 812 960 722.5 960 612c0-92.7-63.1-170.7-148.6-193.3zm36.3 281a123.07 123.07 0 0 1-87.6 36.3H263.9c-33.1 0-64.2-12.9-87.6-36.3A123.3 123.3 0 0 1 140 612c0-28 9.1-54.3 26.2-76.3a125.7 125.7 0 0 1 66.1-43.7l37.9-9.9 13.9-36.6c8.6-22.8 20.6-44.1 35.7-63.4a245.6 245.6 0 0 1 52.4-49.9c41.1-28.9 89.5-44.2 140-44.2s98.9 15.3 140 44.2c19.9 14 37.5 30.8 52.4 49.9 15.1 19.3 27.1 40.7 35.7 63.4l13.8 36.5 37.8 10c54.3 14.5 92.1 63.8 92.1 120 0 33.1-12.9 64.3-36.3 87.7z"></path>
          </svg>
          <div style={{ lineHeight: "0.8" }}>
            <p
              className="text-sm md:text-base lg:text-lg"
              style={{ margin: "0", marginTop: "-4px" }}
            >
              AWS Servers
            </p>
            <p
              className="font-semibold text-xl md:text-2xl lg:text-2xl"
              style={{ margin: "0", marginTop: "-4px" }}
            >
              Cloud
            </p>

            <p
              className="text-xs md:text-sm lg:text-base"
              style={{
                margin: "0",
                marginTop: "-4px",
              }}
            >
              Connected
            </p>
          </div>
        </div>
        <div
          className="col-span-1 bg-white rounded-lg flex gap-2 p-2 truncate 
        justify-start items-center dark:bg-gray-700"
        >
          <img className="w-16 h-16 " src={assets.base} alt="Base" />
          <div style={{ lineHeight: "0.8" }}>
            {!base ? (
              <div className="flex flex-col gap-1 animate-pulse">
                <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-6 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            ) : (
              <>
                <p
                  className="text-sm md:text-base lg:text-lg"
                  style={{ margin: "0", marginTop: "-4px" }}
                >
                  Base Station
                </p>
                <p
                  className="font-semibold text-xl md:text-2xl lg:text-2xl"
                  style={{ margin: "0", marginTop: "-4px" }}
                >
                  {base.DeviceCode}
                </p>
                <p
                  className="text-xs md:text-sm lg:text-base"
                  style={{ margin: "0", marginTop: "-4px" }}
                >
                  {base.Status}
                </p>
              </>
            )}
          </div>
        </div>

        <div
          className="col-span-1 bg-white rounded-lg flex gap-2 p-4 
        justify-start items-center dark:bg-gray-700"
        >
          <div>
            <p className="font-semi-bold text-3xl md:text-6xl lg:text-6xl pr-3">
              {rovers.length}
            </p>
          </div>
          <div>
            <p className="font-semi-bold text-lg md:text-xl lg:text-2xl">
              Client Connected
            </p>
            <div>
              {rovers.map((rover, i) => (
                <div key={i}>
                  <span className="text-xs">{rover.DeviceCode}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white p-4 rounded-lg">
           // <DashboardNotifications userId={userId}/> 
        </div> */}

        <div
          className="col-span-1 md:col-span-2 lg:col-span-3 bg-white p-4 
        rounded-lg dark:bg-gray-800"
        >
          {memoizedRecentProjects}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

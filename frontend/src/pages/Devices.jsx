import React from "react";
import ConnectedDevices from "../components/ConnectedDevices";
import RegisteredDevices from "../components/RegisteredDevices";
import MapDeviceData from "../components/MapDeviceData";
import CriticalAlerts from "../components/CriticalAlerts";
import SectionHeader from "../components/SectionHeader";

const Devices = () => {
  return (
    <div className="min-h-screen p-1 text-gray-900 dark:text-gray-100">
      <SectionHeader title="Devices" subtitle="Track all your devices here" />

      <div className="flex flex-wrap gap-4">
        {/* Left column */}
        <div className="flex-1 min-w-[300px]">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-4 ">
            <MapDeviceData />
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg ">
            <ConnectedDevices />
          </div>
        </div>

        {/* Right column */}
        <div className="flex-1 min-w-[300px]">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-4">
            <CriticalAlerts />
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <RegisteredDevices />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Devices;

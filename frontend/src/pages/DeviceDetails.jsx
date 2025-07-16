import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import PageTopic from "../components/PageTopic";
import { assets } from "../assets/assets";
import { useContext } from "react";
import { Context } from "../context/Context";

const getDeviceTypeIcon = (type, cls = "w-5 h-5") => {
  switch ((type || "").toLowerCase()) {
    case "rover":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none">
          <path
            d="M17 10a6 6 0 11-12 0 6 6 0 0112 0Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M11 16v4M7 20h8" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case "base":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none">
          <rect
            x="4"
            y="8"
            width="16"
            height="14"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M8 8V4M16 8V4" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    default:
      return null;
  }
};

const DeviceDetails = () => {
  const { deviceId } = useParams();
  const { backendUrl } = useContext(Context);

  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ─ Fetch Device Data ─ */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/devices/${deviceId}`
        );
        setDevice(data.device);
      } catch (err) {
        toast.error("Failed to load device");
      } finally {
        setLoading(false);
      }
    })();
  }, [deviceId]);

  useEffect(() => {
    console.log("device", device);
  }, [device]);

  /* ─ Placeholder actions ─ */
  const confirmAction = (title, okMsg) => {
    if (window.confirm(title)) toast.success(okMsg);
  };

  if (loading) return <div className="p-6">Loading…</div>;
  if (!device) return null;

  const badgeClr =
    device.Status === "Online"
      ? "bg-green-600"
      : device.Status === "Offline"
      ? "bg-red-600"
      : "bg-indigo-600";

  return (
    <div className="text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="relative">
        <PageTopic
          topic={device.Name}
          intro={`Device Code: ${device.DeviceCode}`}
        />
        {/* simple badge */}
      <div className="absolute top-4 right-12 hidden md:block">
        <div className="size-16 flex items-center justify-center
                        rounded-full bg-gray-300 dark:bg-gray-700 
                        border border-gray-300 dark:border-gray-600
                        ">
          {getDeviceTypeIcon(device.Type, "w-8 h-8")}
        </div>
      </div>
      </div>

      <div
        className="grid grid-cols-1  
            md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-7
            gap-4 lg:h-screen lg:ml-14"
      >
        {/* Actions Section (Left) */}
        


        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg flex flex-col gap-5 h-max">
          <h2 className="text-base md:text-lg font-semibold pb-5">Overview</h2>



          {/*  */}
          <div className="w-full h-auto rounded-xl flex items-center justify-center mb-6">
              <img
                src={device.Type == "base"? "/images/LandingPage/geonex-b.png":  "/images/LandingPage/geonex-r.png"}
                className="object-contain h-full"
              />
            </div>

          {[
            ["Type", device.Type],
            [
              "Status",
              <span
                key="status"
                className={`px-3 py-1 rounded-xl text-xs md:text-sm w-32 text-center text-white ${badgeClr}`}
              >
                {device.Status}
              </span>,
            ],
            ["Battery", `${device.Battery_Percentage ?? "N/A"} %`],
            ["Signal", device.Signal_Strength ?? "N/A"],
            ["Registered", dayjs(device.Registered_Date).format("MMM D, YYYY")],
            ["Last Update", dayjs(device.Last_Update).fromNow()],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between items-center">
              <span className="font-semibold text-sm md:text-base">
                {label}
              </span>
              {typeof value === "string" ? (
                <span
                  className="px-3 py-1 rounded-xl text-xs md:text-sm w-32 text-center
                             bg-[rgba(232,232,232,1)] dark:bg-gray-700 dark:text-gray-100"
                >
                  {value}
                </span>
              ) : (
                value /* already JSX (Status badge) */
              )}
            </div>
          ))}
        </div>

        {/* ───────────── Overview (right) ───────────── */}

        <div
          className="h-max  p-5 rounded-lg flex flex-col gap-3 overflow-auto
              bg-white dark:bg-gray-800"
        >
          <h2 className="text-base md:text-lg font-semibold pb-5">Actions</h2>

          {/* Rename */}
          {/* <div
            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer
                  bg-[rgba(217,217,217,1)]  hover:bg-[rgba(200,200,200,1)] 
                  dark:bg-gray-700 dark:hover:bg-gray-600"
            onClick={() => confirmAction("Rename this device (static demo)")}
          >
            <img
              className="w-6 h-6 md:w-8 md:h-8"
              //   src={assets.}
              alt="rename"
            />
            <div>
              <h3 className="font-semibold text-sm md:text-base">
                Rename device
              </h3>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                Rename your device
              </p>
            </div>
          </div> */}

          {/* Reset */}
          {/* <div
            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer
                  bg-[rgba(217,217,217,1)]  hover:bg-[rgba(200,200,200,1)] 
                  dark:bg-gray-700 dark:hover:bg-gray-600 "
            onClick={() => {}}
          >
            <img
              className="w-6 h-6 md:w-8 md:h-8"
              //   src={assets.}
              alt="reset"
            />
            <div>
              <h3 className="font-semibold text-sm md:text-base">Reset</h3>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                reset your device
              </p>
            </div>
          </div> */}

          {/* Reset */}
          {/* <div
            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer
                  bg-[rgba(217,217,217,1)]  hover:bg-[rgba(200,200,200,1)] 
                  dark:bg-gray-700 dark:hover:bg-gray-600 "
            onClick={() => {}}
          >
            <img
              className="w-6 h-6 md:w-8 md:h-8"
              //   src={assets.}
              alt="reset"
            />
            <div>
              <h3 className="font-semibold text-sm md:text-base">Reset</h3>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                reset your device
              </p>
            </div>
          </div> */}

          {/* Delete Device */}
          <div
            className="flex items-center gap-3 p-3 rounded-lg bg-red-500 cursor-pointer
                  dark:bg-red-600 dark:hover:bg-red-700 "
            // onClick={handleDelete}
          >
            <img
              className="w-6 h-6 md:w-8 md:h-8"
              src={assets.bin}
              alt="delete"
            />
            <div>
              <h3 className="font-semibold text-white text-sm md:text-base">
                Delete Device
              </h3>
              <p className="text-xs md:text-sm text-white">
                This action cannot be undone
              </p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default DeviceDetails;

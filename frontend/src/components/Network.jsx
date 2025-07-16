import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Network = ({ data, onChange }) => {
  const [type, setType] = useState(data.mqttUrlType);
  const [url, setUrl] = useState(data.customMqttUrl);
  const [status, setStatus] = useState(""); // "saved" | "reset" | ""

  // useEffect(() => {
  //   console.log("type:", type);
  //   console.log("url:", url);
  // }, [type, url]);

  const handleSave = () => {
    // Only save when Custom selected
    if (type === "Default") return;
    if (url === "") {
      toast.info("Please enter MQTT broker URL");
      return;
    }
    console.log(type, url);

    // First push mqttUrlType
    onChange("mqttUrlType", type);

    // Push url 350 ms later
    setTimeout(() => {
      onChange("customMqttUrl", url);
    }, 350);

    toast.success("Network settings saved");

    // (Optional) user feedback
    setStatus("saved");
    setTimeout(() => setStatus(""), 2000);
  };

  const handleReset = () => {
    // instantly reset UI
    setType("Default");
    setUrl("");

    // push to backend
    onChange("mqttUrlType", "Default");

    setTimeout(() => {
      onChange("customMqttUrl", "");
    }, 350);

    toast.info("Network reset to Default");
  };

  /* ----- decide variant ----- */
  const backendIsCustom = data.mqttUrlType === "Custom";
  let variant; // disabled | idle | active
  if (backendIsCustom) variant = "active"; // blue
  else if (type === "Custom") variant = "idle"; // red
  else variant = "disabled"; // gray

  const classesByVariant = {
    disabled: "bg-gray-400 dark:bg-gray-600 cursor-not-allowed",
    idle: "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700",
    active: "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700",
  };

  const buttonLabel = backendIsCustom ? "RESET TO DEFAULT" : "SAVE NETWORK";
  const buttonAction = backendIsCustom ? handleReset : handleSave;
  const isDisabled = variant === "disabled";

  return (
    <div>
      <h2 className="font-semibold text-xl">Network</h2>

      <div className="flex items-center justify-between mt-4">
        <span>EasyConnect URL</span>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="text-blue-600 cursor-pointer outline-none rounded px-2 py-1 
          dark:text-indigo-400 dark:bg-gray-800"
        >
          <option>Default</option>
          <option>Custom</option>
        </select>
      </div>
      <hr className="border-gray-300 dark:border-gray-600" />

      <label className="block font-medium text-lg mt-4">Custom  URL</label>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Custom MQTT broker URL"
        disabled={type !== "Custom"}
        className={`w-full rounded-full mt-2 mb-4 py-2 px-4 ${
          type === "Custom"
            ? "border border-gray-300 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
            : "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
        }`}
      />
      <hr className="border-gray-300 dark:border-gray-600" />

      {/* dynamic single button */}
      <button
        onClick={buttonAction}
        disabled={isDisabled}
        className={`w-full rounded-full py-2 mt-4 text-white transition ${classesByVariant[variant]}`}
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default Network;

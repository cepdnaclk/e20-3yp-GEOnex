import { useState } from "react";
import Button from "./Button"; // ✅ Remove { Button }


const AddProject = () => {
  const [selectedDevice, setSelectedDevice] = useState(null);

  const devices = [
    { id: "RC002", description: "#001 Lynx" },
    { id: "RC059", description: "#0239 Sheen" },
    { id: "RC058", description: "_011L" },
  ];
  console.log("AddProject component loaded");

  return (
    <div className="p-10 border-2 border-red-500">
      <h2 className="text-2xl font-semibold">Add New Project</h2>
      <p className="text-gray-500">Setup your new project</p>
      
      <div className="bg-white p-5 rounded shadow mt-5 w-1/2">
        <label className="block text-gray-700">Project Name</label>
        <input className="w-full p-2 border rounded mt-1" defaultValue="tmp_project_01" />
        
        <label className="block text-gray-700 mt-3">Base Station</label>
        <select className="w-full p-2 border rounded mt-1">
          <option>Select the Base Station</option>
        </select>
        
        <label className="block text-gray-700 mt-3">Available Client Devices</label>
        <div className="mt-2">
          {devices.map((device) => (
            <label key={device.id} className="flex items-center space-x-2 p-2 border rounded mt-1">
              <input
                type="radio"
                name="device"
                value={device.id}
                checked={selectedDevice === device.id}
                onChange={() => setSelectedDevice(device.id)}
              />
              <span className="font-medium">{device.id}</span>
              <span className="text-gray-500 text-sm">{device.description}</span>
            </label>
          ))}
        </div>
        
        <label className="block text-gray-700 mt-3">Description</label>
        <textarea className="w-full p-2 border rounded mt-1" placeholder="Short description of the project"></textarea>
        
        <Button className="bg-black text-white w-full mt-5">Start Survey</Button>
      </div>
    </div>
  );
  
}

export default AddProject;
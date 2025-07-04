import React, { useState } from "react";

const RenamePointPopup = ({ existingName, onRename, onDiscard }) => {
  const [newName, setNewName] = useState(existingName || "");

  const handleRenameClick = () => {
    if (!newName.trim()) {
      alert("Name cannot be empty");
      return;
    }
    onRename(newName.trim());
  };

  return (
    <div
      className="bg-white p-2 rounded-2xl shadow-lg 
      w-full md:w-[280px] 
      text-center"
    >
      {/* Title */}
      <h2 className="sm:text-lg md:text-xl font-bold">Modify the Point</h2>

      {/* Divider */}
      <div className="border-t border-black my-3"></div>

      <div className="mt-4 px-4">
        <label className="block text-sm md:text-base text-gray-700">
          Enter a new name
        </label>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="w-full  mt-1 p-1 border rounded-xl text-sm md:text-base text-center"
          style={{ backgroundColor: "rgba(232, 232, 232, 1)" }}
        />
      </div>

      {/* Buttons */}
      <div className="mt-4 px-4 flex flex-col gap-2 ">
        <button
          className="bg-black text-white p-2 rounded-xl text-sm md:text-base"
          onClick={handleRenameClick}
        >
          Save Changes
        </button>

        <button
          className=" p-1 rounded-xl text-sm md:text-base mb-2"
          style={{ backgroundColor: "rgba(232, 232, 232, 1)" }}
          onClick={onDiscard}
        >
          Discard
        </button>
      </div>
    </div>
  );
};

export default RenamePointPopup;

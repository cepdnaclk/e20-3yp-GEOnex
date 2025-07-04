import React from 'react';
import { useState, useContext } from 'react';
import { Context } from "../context/Context";

const SectionsOverview = () => {
    const { navigate, backendUrl, removeProject, fetchProject,project, setProject, updateProjectSections, removeProjectSection} = useContext(Context);
    const [newSection, setNewSection] = useState("");

   const projectId = project._id;


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

    return (
        <div className="bg-white p-5 rounded-lg flex flex-col gap-2 h-max max-w-xl">
              <h2 className="text-base md:text-lg font-semibold pb-2">Sections</h2>

             <div className="w-full max-w-4xl mx-auto">
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

    );
};

export default SectionsOverview;
const {getDb} = require('../config/db');
const Project = require('../models/Project');
const {ObjectId} = require('mongodb');

// Create new project
const createProject = async (req, res) => {
    
    try {
        const { UserId, Name, Description, BaseStation, ClientDevices } = req.body;
        
        const newProject = new Project({
            User_Id:UserId,
            Name,
            Description,
            BaseStation,
            ClientDevices,
            Created_On: new Date(),      
            Last_Modified: new Date() 


        });

        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all projects
const getProjects = async (req, res) => {
    console.log("Get project request came");
    const userid = req.params.userid; 
    const db = getDb();
    try {
        const projects = await db.collection('projects').find({ User_Id: new ObjectId(userid) }).toArray();
        console.log(projects);
        res.json({success:true,projects});
    } catch (error) {
        res.status(500).json({success:false , message: 'Error fetching projects', error});
    }
};

const getProjectById = async (req, res) => {
    const db = getDb();
    const id = req.params.id; 

    try {
        const project = await db.collection('projects').findOne({ _id: new ObjectId(id) });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json({success:true, project});
    } catch (error) {
        console.error("Error fetching project:", error);
        res.status(500).json({success:false , message: 'Error fetching project', error: error.message });
    }
};

const updateProject = async (req, res) => {
    const db = getDb();
    const id = Number(req.params.id); 
    const { Name, Description } = req.body;

    try {
        const result = await db.collection('projects').updateOne(
            { Project_Id: id }, 
            { $set: { Name, Description, Last_Modified: new Date() } } 
        );

        if (result.matchedCount === 0) { 
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json({ message: 'Project updated successfully' });
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({ message: 'Error updating project', error });
    }
};

const deleteProject = async (req, res) => {
    const id = req.params.id;  
    const db = getDb();

    try {
        const result = await db.collection('projects').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {  
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).json({ message: 'Error deleting project', error: error.message });
    }
};


// Add a new section to a project
const modifySectionToProject = async (req, res) => {
    const db = getDb();
    const projectId = req.params.id;  
    const { sectionName } = req.body;

    try {
        // Check if the project exists
        const project = await db.collection('projects').findOne({ _id: new ObjectId(projectId) });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Add the new section to the project's Sections array
        const result = await db.collection('projects').updateOne(
            { _id: new ObjectId(projectId) },
            { $addToSet: { Sections: sectionName } } 
        );

        if (result.modifiedCount === 0) {
            return res.status(400).json({ message: 'Failed to add section' });
        }

        res.json({ success: true, message: 'Section added successfully', projectId });
    } catch (error) {
        console.error("Error modifying section to project:", error);
        res.status(500).json({ message: 'Error modifying section to project', error: error.message });
    }
    
}



module.exports = {createProject, getProjects, getProjectById, updateProject, deleteProject, modifySectionToProject};
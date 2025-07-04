const {getDb} = require('../config/db.js');
const Point = require('../models/Point');
const Project = require('../models/Project.js');
const {ObjectId} = require('mongodb');


// Create new point
const createPoint = async (req, res) => {
    try {
        const {ProjectId, Name, Type, Latitude, Longitude, Accuracy, Timestamp, Device} = req.body;
        
        // Validate required fields (adjust based on your business logic)
        if (!Name || Latitude == null || Longitude == null || !Timestamp || !ProjectId) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        
        const newPoint = new Point({ 
            ProjectId,
            Name,
            Type: Type || "recorded",
            Latitude,
            Longitude,
            Accuracy: Accuracy || null,
            Timestamp: Timestamp || null,
            Device: Device || null,
            Section: req.body.Section || "default" 
        });

        // Save the new point to the database
        const savedPoint = await newPoint.save();

        // Update the project with the new point
        await Project.findByIdAndUpdate(
            ProjectId,
            {
                $push: { Points: savedPoint._id },
                $inc: { Total_Points: 1 }
            }
        );

        // Return the saved point in the response
        return res.status(201).json(savedPoint);

    } catch (error) {
        console.error("Error creating point:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all points by project id
const getPointsByProjectId = async (req, res) => {

    const db = getDb();

    try {
        const { projectId } = req.params;

        if (!projectId) {
            return res.status(400).json({ error: "Missing project id" });
        }

        if (!ObjectId.isValid(projectId)) {
            return res.status(400).json({ error: "Invalid Project ID" });
        }

        const points = await db.collection('points').find({ ProjectId: new ObjectId(projectId) }).toArray();

        return res.status(200).json({success: true,points});

    } catch (error) {
        console.error("Error retrieving points:", error);
        return res.status(500).json({ error: "Server error", message: error.message });
    }
};

// Delete point by ID and project ID
const deletePoint = async (req, res) => {
    const db = getDb();
    
    try {
        const { projectId, id } = req.params;

        // Validate that both IDs are provided
        if (!projectId || !id) {
            return res.status(400).json({ error: "Missing project id or point id" });
        }

        if (!ObjectId.isValid(projectId) || !ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid project id or point id" });
        }

        const result = await db.collection('points').deleteOne({
            ProjectId: new ObjectId(projectId), 
            _id: new ObjectId(id)
        });

        

        if (!result.deletedCount) {
            return res.status(404).json({ error: 'Point not found'});
        }

        // Update the project with the new point
        await Project.findByIdAndUpdate(
            projectId,
            {
                $pull: { Points: id },
                $inc: { Total_Points: -1 }
            }
        );

        return res.status(200).json({success:true, message: "Point deleted successfully" });
    } catch (error) {
        console.error("Error deleting point:", error);
        return res.status(500).json({ error: "Server error", message: error.message });
    }

};

// Rename point by ID and project ID
const renamePoint = async (req, res) => {
    const db = getDb();
    
    try {
        const { projectId, id } = req.params;
        const { Name } = req.body;

        // Validate that both IDs are provided
        if (!projectId || !id) {
            return res.status(400).json({ error: "Missing project id or point id" });
        }

        if (!ObjectId.isValid(projectId) || !ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid project id or point id" });
        }

        if (!Name || typeof Name !== 'string') {
            return res.status(400).json({ message: "New Name is required and must be a string" });
        }

        const result = await db.collection('points').updateOne(
            { ProjectId: new ObjectId(projectId), _id: new ObjectId(id) },
            { $set: { Name } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ success:false, message: "Point not found" });
        }

        return res.status(200).json({ success:true, message: "Point renamed successfully", point: result.value});
    
    } catch (error) {
        console.error("Error renaming point:", error);
        return res.status(500).json({ error: "Server error", message: error.message });
    }

};

// Modify point by ID and project ID
const modifyPoint = async (req, res) => {
  const db = getDb();
  const { projectId, id } = req.params;

  if (!ObjectId.isValid(projectId) || !ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid projectId or point id" });
  }

  // Get fields from body — only update the fields that exist in req.body
  const updateFields = {};
  const allowedFields = ['Name', 'Type', 'Latitude', 'Longitude', 'Accuracy', 'Timestamp', 'Device'];

  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateFields[field] = req.body[field];
    }
  });

  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ message: "No valid fields provided to update" });
  }

  try {
    const result = await db.collection('points').findOneAndUpdate(
      { ProjectId: new ObjectId(projectId), _id: new ObjectId(id) },
      { $set: updateFields },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return res.status(404).json({ message: "Point not found" });
    }

    res.json({ message: "Point updated successfully", point: result.value });
  } catch (error) {
    console.error("Error modifying point:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete all point of a project
const deleteAllPoints = async (req, res) => {
    const db = getDb();
    const projectId = Number(req.params.projectId); 
    try {
        const result = await db.collection('points').deleteMany({Project_Id: projectId});
        res.json({message: 'All points deleted successfully'});
    } catch (error) {
        res.status(500).json({message: 'Error deleting points', error});
    }
};

module.exports = { createPoint, getPointsByProjectId, deletePoint, modifyPoint, deleteAllPoints, renamePoint };
  
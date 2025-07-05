const fs = require("fs").promises;
const {ObjectId} = require('mongodb');
const { getDb } = require("../config/db");

const { exportToTxt,  exportToDxf, exportToPdf, exportToCsv } = require("../utils/export");


// Validation middleware for projectId
const validateProjectId = (req, res, next) => {
  const { projectId } = req.params;
  
  if (!projectId || projectId.trim() === '') {
    return res.status(400).json({ 
      message: "User ID is required",
      error: "Invalid or missing projectId parameter"
    });
  }
  
  // Optional: Add additional validation for projectId format
  if (!/^[a-zA-Z0-9_-]+$/.test(projectId)) {
    return res.status(400).json({
      message: "Invalid user ID format",
      error: "User ID can only contain alphanumeric characters, hyphens, and underscores"
    });
  }
  
  next();
};

// Helper function to handle file cleanup
const cleanupFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.warn(`Failed to cleanup temporary file: ${filePath}`, error.message);
  }
};


const exportTxt = async (req, res) => {
  let filePath = null;
  
  try {
    const { projectId} = req.params;
    if (!ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: "Invalid Project ID" });
    }

    const db = getDb();
    const cursor = await db.collection('points').find({ 
      ProjectId: new ObjectId(projectId) 
    });

    // fetch project name
    const project = await db.collection('projects').findOne({ _id: new ObjectId(projectId) });
    if (!project) {
      return res.status(404).json({
        message: "Project not found",
        projectId
      });
    }

    const points = await cursor.toArray();
    
    if (!points || points.length === 0) {
      return res.status(404).json({ 
        message: "No points found for the specified user",
        projectId 
      });
    }
    
    const safeProjectName = project.Name.trim().replace(/\s+/g, '-');
    const filename = `points-${safeProjectName}-${Date.now()}.txt`;
    filePath = await exportToTxt(points, filename,safeProjectName);
    
    if (!filePath || !(await fs.access(filePath).then(() => true).catch(() => false))) {
      throw new Error("Failed to generate TXT file");
    }
    
    // Set proper headers
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Send file and cleanup after response
    res.download(filePath, filename, (err) => {
      if (err) {   
        console.error("Error sending TXT file:", err);
      }
      // Cleanup temp file
      cleanupFile(filePath);
    });
    
  } catch (err) {
    console.error("TXT export error:", err);
    if (filePath) {
      cleanupFile(filePath);
    }
    res.status(500).json({ 
      message: "Error generating TXT export", 
      error: process.env.NODE_ENV === 'development' ? err.message : "Internal server error"
    });
  }
}


// CSV export function
const exportCsv = async (req, res) => {
  let filePath = null;
  try {
    const { projectId } = req.params;
    if (!ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: "Invalid Project ID" });
    }
    const db = getDb();
    const cursor = await db.collection('points').find({
      ProjectId: new ObjectId(projectId)
    });
    
    const project = await db.collection('projects').findOne({ _id: new ObjectId(projectId) });
    if (!project) {
      return res.status(404).json({
        message: "Project not found",
        projectId
      });
    }
    const points = await cursor.toArray();
    if (!points || points.length === 0) {
      return res.status(404).json({
        message: "No points found for the specified user",
        projectId
      });
    }
    const safeProjectName = project.Name.trim().replace(/\s+/g, '-');
    const filename = `points-${safeProjectName}-${Date.now()}.csv`;
    filePath = await exportToCsv(points, filename, safeProjectName, true);
    if (!filePath || !(await fs.access
(filePath).then(() => true).catch(() => false))) {
      throw new Error("Failed to generate CSV file");
    }

    // Set proper headers
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    // Send file and cleanup after response
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error("Error sending CSV file:", err);
      }
      // Cleanup temp file
      cleanupFile(filePath);
    });
  } catch (err) {
    console.error("CSV export error:", err);
    if (filePath) {
      cleanupFile(filePath);
    }
    res.status(500).json({
      message: "Error generating CSV export",
      error: process.env.NODE_ENV === 'development' ? err.message : "Internal server error"
    });
  }
}





const exportDxf =  async (req, res) => {
  let filePath = null;
  
  try {
    const { projectId} = req.params;
    if (!ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: "Invalid Project ID" });
    }

    const db = getDb();
    const cursor = await db.collection('points').find({ 
      ProjectId: new ObjectId(projectId) 
    });
    const points = await cursor.toArray();
    
    if (!points || points.length === 0) {
      return res.status(404).json({ 
        message: "No points found for the specified user",
        projectId 
      });
    }
    
    const filename = `points-${projectId}-${Date.now()}.dxf`;
    filePath = await exportToDxf(points, filename);
    
    if (!filePath || !(await fs.access(filePath).then(() => true).catch(() => false))) {
      throw new Error("Failed to generate DXF file");
    }
    
    // Set proper headers
    res.setHeader('Content-Type', 'application/dxf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Send file and cleanup after response
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error("Error sending DXF file:", err);
      }
      // Cleanup temp file
      cleanupFile(filePath);
    });
    
  } catch (err) {
    console.error("DXF export error:", err);
    if (filePath) {
      cleanupFile(filePath);
    }
    res.status(500).json({ 
      message: "Error generating DXF export", 
      error: process.env.NODE_ENV === 'development' ? err.message : "Internal server error"
    });
  }
}


// PDF export function
// This function generates a PDF report of points associated with a project

const exportPdf = async (req, res) => {
  let filePath = null;
  
  try {
    const { projectId} = req.params;
    if (!ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: "Invalid Project ID" });
    }

    const db = getDb();
    const cursor = await db.collection('points').find({ 
      ProjectId: new ObjectId(projectId) 
    });
    const points = await cursor.toArray();

    const project = await db.collection('projects').findOne({ _id: new ObjectId(projectId) });
    if (!project) {
      return res.status(404).json({
        message: "Project not found",
        projectId
      });
    }
    
    if (!points || points.length === 0) {
      return res.status(404).json({ 
        message: "No points found for the specified user",
        projectId 
      });
    }
    
    const safeProjectName = project.Name.trim().replace(/\s+/g, '-');
    const filename = `points-${safeProjectName}-${Date.now()}.txt`;
    filePath = await exportToPdf(points, filename,project);
    
    if (!filePath || !(await fs.access(filePath).then(() => true).catch(() => false))) {
      throw new Error("Failed to generate PDF file");
    }
    
    // Set proper headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Send file and cleanup after response
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error("Error sending PDF file:", err);
      }
      // Cleanup temp file
      cleanupFile(filePath);
    });
    
  } catch (err) {
    console.error("PDF export error:", err);
    if (filePath) {
      cleanupFile(filePath);
    }
    res.status(500).json({ 
      message: "Error generating PDF export", 
      error: process.env.NODE_ENV === 'development' ? err.message : "Internal server error"
    });
  }
}


module.exports = {
  exportTxt,
  exportCsv,
  exportDxf,
  exportPdf,
  validateProjectId,
  
};
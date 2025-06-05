const express = require("express");
const router = express.Router();
const { 
  exportTxt, 
  // exportPng, 
  exportDxf, 
  exportPdf ,
  validateProjectId
} = require("../controllers/exportController");


// Export TXT
router.get("/txt/:projectId", validateProjectId, exportTxt );

// // Export PNG
// router.get("/png/:projectId", validateProjectId, exportPng);

// Export DXF
router.get("/dxf/:projectId", validateProjectId,exportDxf );

// Export PDF
router.get("/pdf/:projectId", validateProjectId, exportPdf );



// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    service: "Export Router",
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
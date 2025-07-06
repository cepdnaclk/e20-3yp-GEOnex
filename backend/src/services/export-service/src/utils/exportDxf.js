const fs = require('fs');
const path = require('path');

// Simple point entity creator
const makePointEntity = (x, y, z = 0, layer = "POINTS") => [
  "0", "POINT",
  "8", layer,
  "10", x.toFixed(6),
  "20", y.toFixed(6),
  "30", z.toFixed(6)
];

// Convert lat/lng to relative coordinates
const convertToRelativeCoordinates = (points) => {
  if (!points || points.length === 0) return [];
  
  // Find the minimum lat/lng to use as origin
  const minLat = Math.min(...points.map(p => p.Latitude));
  const minLng = Math.min(...points.map(p => p.Longitude));
  
  // Convert to relative coordinates (approximate meters)
  // 1 degree latitude ≈ 111,111 meters
  // 1 degree longitude ≈ 111,111 * cos(latitude) meters
  const avgLat = points.reduce((sum, p) => sum + p.Latitude, 0) / points.length;
  const latToMeters = 111111;
  const lngToMeters = 111111 * Math.cos(avgLat * Math.PI / 180);
  
  return points.map(p => ({
    ...p,
    x: (p.Longitude - minLng) * lngToMeters,
    y: (p.Latitude - minLat) * latToMeters,
    z: 0 // Default elevation
  }));
};

// Enhanced DXF export for points
const exportToDxf = (points, filename, options = {}) => {
  const { layer = "POINTS", ensureDirectory = true, useRelativeCoords = true } = options;
  
  // Validate points
  if (!points || points.length === 0) {
    throw new Error("No points to export");
  }

  // Convert to relative coordinates if needed
  let processedPoints = points;
  if (useRelativeCoords && points[0].Latitude !== undefined) {
    processedPoints = convertToRelativeCoordinates(points);
    console.log(`📍 Converted ${points.length} GPS coordinates to relative coordinates`);
  }

  // Ensure export directory exists
  const exportDir = path.join(__dirname, "../exports");
  if (ensureDirectory && !fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  // Generate point entities
  const pointEntities = processedPoints.flatMap(p => 
    makePointEntity(p.x, p.y, p.z, p.layer || layer)
  );

  // Complete DXF structure
  const dxfContent = [
    // Header
    "0", "SECTION",
    "2", "HEADER",
    "9", "$ACADVER",
    "1", "AC1015", // AutoCAD 2000 format
    "0", "ENDSEC",

    // Tables (layer definition)
    "0", "SECTION",
    "2", "TABLES",
    "0", "TABLE",
    "2", "LAYER",
    "70", "1",
    "0", "LAYER",
    "2", layer,
    "70", "0",
    "62", "7", // White/black color
    "6", "CONTINUOUS",
    "0", "ENDTAB",
    "0", "ENDSEC",

    // Entities
    "0", "SECTION",
    "2", "ENTITIES",
    ...pointEntities,
    "0", "ENDSEC",
    
    "0", "EOF"
  ].join("\n");

  // Write file
  const filePath = path.join(exportDir, filename);
  try {
    fs.writeFileSync(filePath, dxfContent, 'utf8');
    console.log(`✅ Exported ${points.length} points to ${filePath}`);
    return filePath;
  } catch (error) {
    throw new Error(`Failed to write DXF file: ${error.message}`);
  }
};

module.exports = { exportToDxf, makePointEntity, convertToRelativeCoordinates };
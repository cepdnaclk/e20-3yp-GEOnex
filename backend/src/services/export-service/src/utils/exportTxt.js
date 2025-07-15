const fs = require("fs");
const path = require("path");
const utm = require("utm");
const { transformToSLD99 } = require("./convertSLD99");




const exportToTxt = (points, filename, projectName) => {
  if (!points || points.length === 0) {
    throw new Error("No points to export");
  }

  // Create data rows in the format: point_number,easting,northing,0.0,name
  const dataRows = points.map((p, i) => {
    const pointId = (i + 1).toString();
    const name = p.Name || p.Type || "";

    let easting = "", northing = "";
    if (p.Latitude != null && p.Longitude != null) {
      try {
        const sld99Coord = transformToSLD99(p.Latitude, p.Longitude);
        easting = sld99Coord.easting.toFixed(3);
        northing = sld99Coord.northing.toFixed(3);
      } catch (error) {
        console.warn(`Warning: Could not transform coordinates for point ${pointId}:`, error.message);
        easting = "0.000";
        northing = "0.000";
      }
    }

    // Format: point_number,easting,northing,0.0,name
    return `${pointId},${easting},${northing},0.0,${name}`;
  }).join("\n");

  // Ensure export directory exists
  const exportDir = path.join(__dirname, "../exports");
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  // Write file with proper encoding
  const filePath = path.join(exportDir, filename);
  fs.writeFileSync(filePath, dataRows, 'utf8');

  // Log success
  console.log(`✅ TXT file exported successfully: ${filePath}`);
  console.log(`📊 Exported ${points.length} points in SLD99 format`);
  
  return filePath;
};

module.exports = { exportToTxt };
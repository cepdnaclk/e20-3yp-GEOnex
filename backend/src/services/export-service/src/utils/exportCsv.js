const fs = require("fs");
const path = require("path");
const utm = require("utm");


const exportToCsv = (points, filename, projectName, includeHeader = true) => {
  // Input validation
  if (!points || !Array.isArray(points) || points.length === 0) {
    throw new Error("No valid points array provided for export");
  }
  
  if (!filename || typeof filename !== 'string') {
    throw new Error("Valid filename is required");
  }
  
  if (!projectName || typeof projectName !== 'string') {
    throw new Error("Valid project name is required");
  }

  const totalPoints = points.length;
  const timestamp = new Date().toLocaleString();
  const separator = '='.repeat(50);
  
  // Create header section with consistent formatting
  const header = [
    'GEOnex Survey Export File',
    separator,
    `Generated At:    ${timestamp}`,
    `Project Name:    ${projectName}`,
    `Total Points:    ${totalPoints}`,
    separator,
    ''
  ].join('\r\n');
  
  // Define column headers
  const columnHeaders = [
    '"PointID"',
    '"Easting"',
    '"Northing"',
    '"Zone"',
    '"Description"'
  ].join(',');
  
  // Process data rows with error handling
  const dataRows = points.map((point, index) => {
    const pointId = (index + 1).toString();
    const description = point.Name || point.Type || '';
    let easting = '', northing = '', zone = '';
    
    // Convert coordinates if available
    if (point.Latitude != null && point.Longitude != null) {
      try {
        const utmCoord = utm.fromLatLon(point.Latitude, point.Longitude);
        easting = utmCoord.easting.toFixed(3);
        northing = utmCoord.northing.toFixed(3);
        zone = `${utmCoord.zoneNum}${utmCoord.zoneLetter}`;
      } catch (error) {
        console.warn(`⚠️ Failed to convert coordinates for point ${pointId}:`, error.message);
      }
    }
    
    // Escape quotes in description field
    const escapedDescription = description.replace(/"/g, '""');
    
    return `"${pointId}","${easting}","${northing}","${zone}","${escapedDescription}"`;
  }).join('\n');
  
  // Create footer section
  const footer = [
    '',
    separator,
    `End of Export - ${totalPoints} points processed`,
    'Automatically Generated by GEOnex Survey System',
    separator
  ].join('\n');
  
  // Combine all sections
  const contentSections = [];
  if (includeHeader) {
    contentSections.push(header, columnHeaders);
  }
  contentSections.push(dataRows, footer);
  
  const content = contentSections.filter(Boolean).join('\n');
  
  try {
    // Ensure export directory exists
    const exportDir = path.join(__dirname, '../exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }
    
    // Generate full file path
    const filePath = path.join(exportDir, filename);
    
    // Write file with UTF-8 encoding
    fs.writeFileSync(filePath, content, { encoding: 'utf8' });
    
    // Log success with file size
    const stats = fs.statSync(filePath);
    console.log(`✅ CSV export completed successfully:`);
    console.log(`   📁 File: ${filePath}`);
    console.log(`   📊 Size: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`   📍 Points: ${totalPoints}`);
    
    return filePath;
    
  } catch (error) {
    console.error(`❌ CSV export failed:`, error.message);
    throw new Error(`Failed to export CSV file: ${error.message}`);
  }
};

module.exports = { exportToCsv };
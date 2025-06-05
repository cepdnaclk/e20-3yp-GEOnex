const fs = require("fs");
const path = require("path");

const utm = require("utm");

// TXT Export with Easting/Northing from Latitude/Longitude
const exportToTxt = (points, filename) => {
  if (!points || points.length === 0) {
    throw new Error("No points to export");
  }

  const header = "PointID, Easting, Northing, Zone, Description\n";

  const rows = points.map((p, i) => {
    const pointId = i + 1;
    const description = p.Name || p.Type || "";

    // Convert to UTM
    let easting = "", northing = "", zone = "";
    if (p.Latitude != null && p.Longitude != null) {
      const utmCoord = utm.fromLatLon(p.Latitude, p.Longitude);
      easting = utmCoord.easting.toFixed(3);
      northing = utmCoord.northing.toFixed(3);
      zone = `${utmCoord.zoneNum}${utmCoord.zoneLetter}`;
    }

    return `${pointId}, ${easting}, ${northing}, ${zone}, ${description}`;
  }).join("\n");

  const content = header + rows;
  const filePath = path.join(__dirname, "../exports", filename);
  fs.writeFileSync(filePath, content);

  return filePath;
};

module.exports = { exportToTxt };




// Haversine formula to calculate distance in meters
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // Radius of Earth in meters
  const toRad = deg => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// const exportToPng = (points, filename) => {
//   if (!points || points.length === 0) throw new Error("No points to export");

//   const canvasSize = 800;
//   const padding = 60;
//   const canvas = createCanvas(canvasSize, canvasSize);
//   const ctx = canvas.getContext("2d");

//   // Background
//   ctx.fillStyle = "#fff";
//   ctx.fillRect(0, 0, canvasSize, canvasSize);

//   // Get bounds
//   const lats = points.map(p => p.Latitude);
//   const lngs = points.map(p => p.Longitude);
//   const minLat = Math.min(...lats);
//   const maxLat = Math.max(...lats);
//   const minLng = Math.min(...lngs);
//   const maxLng = Math.max(...lngs);

//   const scaleX = (canvasSize - 2 * padding) / (maxLng - minLng || 1);
//   const scaleY = (canvasSize - 2 * padding) / (maxLat - minLat || 1);

//   // Normalize coords
//   const normalize = (lat, lng) => ({
//     x: padding + (lng - minLng) * scaleX,
//     y: canvasSize - (padding + (lat - minLat) * scaleY),
//   });

//   // Draw lines & distances
//   ctx.strokeStyle = "#0077cc";
//   ctx.fillStyle = "#000";
//   ctx.lineWidth = 2;
//   ctx.font = "14px Arial";

//   for (let i = 0; i < points.length; i++) {
//     const curr = points[i];
//     const next = points[(i + 1) % points.length]; // loop if polygon

//     const p1 = normalize(curr.Latitude, curr.Longitude);
//     const p2 = normalize(next.Latitude, next.Longitude);

//     // Draw line
//     ctx.beginPath();
//     ctx.moveTo(p1.x, p1.y);
//     ctx.lineTo(p2.x, p2.y);
//     ctx.stroke();

//     // Distance label
//     const dist = calculateDistance(curr.Latitude, curr.Longitude, next.Latitude, next.Longitude);
//     const midX = (p1.x + p2.x) / 2;
//     const midY = (p1.y + p2.y) / 2;
//     ctx.fillText(`${dist.toFixed(1)} m`, midX + 5, midY - 5);
//   }

//   // Draw points
//   ctx.fillStyle = "#ff0000";
//   points.forEach(p => {
//     const { x, y } = normalize(p.Latitude, p.Longitude);
//     ctx.beginPath();
//     ctx.arc(x, y, 5, 0, 2 * Math.PI);
//     ctx.fill();
//     ctx.fillText(p.Name || '', x + 6, y - 6);
//   });

//   // Axes
//   ctx.strokeStyle = "#ccc";
//   ctx.beginPath();
//   ctx.moveTo(padding, canvasSize - padding);
//   ctx.lineTo(canvasSize - padding, canvasSize - padding);
//   ctx.lineTo(canvasSize - padding, padding);
//   ctx.stroke();

//   // Save PNG
//   const filePath = path.join(__dirname, "../exports", filename);
//   fs.writeFileSync(filePath, canvas.toBuffer("image/png"));
//   return filePath;
// };

// module.exports = { exportToPng };



// Helper to create DXF entity blocks
const makePointEntity = (x, y, z = 0) => [
  "0", "POINT",
  "8", "POINTS", // layer name
  "10", x.toFixed(3),
  "20", y.toFixed(3),
  "30", z.toFixed(3)
];

const makePolylineEntity = (points) => {
  const vertices = points.flatMap(p => [
    "0", "VERTEX",
    "8", "POLYLINE",
    "10", p.x.toFixed(3),
    "20", p.y.toFixed(3),
    "30", p.z?.toFixed(3) || "0"
  ]);

  return [
    "0", "POLYLINE",
    "8", "POLYLINE",
    "66", "1",       // vertices follow
    "70", "1",       // closed polyline
    ...vertices,
    "0", "SEQEND"
  ];
};

const exportToDxf = (points, filename) => {
  if (!points || points.length === 0) throw new Error("No points to export");

  // DXF file structure
  const dxfContent = [
    "0", "SECTION",
    "2", "HEADER",
    "0", "ENDSEC",

    "0", "SECTION",
    "2", "TABLES",
    "0", "ENDSEC",

    "0", "SECTION",
    "2", "ENTITIES",

    // Points
    ...points.flatMap(p => makePointEntity(p.x, p.y, p.z)),

    // Polyline
    ...makePolylineEntity(points),

    "0", "ENDSEC",
    "0", "EOF"
  ].join("\n");

  const filePath = path.join(__dirname, "../exports", filename);
  fs.writeFileSync(filePath, dxfContent);
  return filePath;
};


const PDFDocument = require("pdfkit");


const exportToPdf = (points, filename) => {
  return new Promise((resolve, reject) => {
    if (!points || points.length === 0) {
      reject(new Error("No points to export"));
      return;
    }

    const doc = new PDFDocument({ margin: 50 });
    const filePath = path.join(__dirname, "../exports", filename);
    
    // Create directory if it doesn't exist
    const exportDir = path.dirname(filePath);
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Handle completion and errors
    writeStream.on('finish', () => resolve(filePath));
    writeStream.on('error', reject);

    // Title
    doc.fontSize(20).text("GEOnex Survey Points", { align: "center" });
    doc.moveDown();

    // Table Header
    const headerY = doc.y;
    doc.fontSize(12);
    doc.text("Name", 50, headerY);
    doc.text("Easting", 180, headerY);
    doc.text("Northing", 280, headerY);
    doc.text("Elevation", 400, headerY);
    doc.moveDown(1.5);

    const scaledPoints = [];

    // Table Rows
    points.forEach(p => {
      const name = p.Name || "-";
      const lat = p.Latitude;
      const lon = p.Longitude;
      const elev = p.Elevation ?? 0;

      // Simulate Easting/Northing from Lat/Lon (simple scaling)
      const easting = (lon - 80.0) * 100000;
      const northing = (lat - 7.0) * 100000;

      scaledPoints.push({ name, easting, northing });

      // Store current Y position for this row
      const rowY = doc.y;
      
      // Position each text element at the same Y coordinate
      doc.text(name, 50, rowY);
      doc.text(easting.toFixed(2), 180, rowY);
      doc.text(northing.toFixed(2), 280, rowY);
      doc.text(elev.toFixed(2), 400, rowY);
      
      // Move to next row
      doc.y = rowY + 15;
    });

    // Optional: Draw a simple map
    doc.addPage();
    doc.fontSize(14).text("Point Map Visualization", { align: "center" });
    doc.moveDown();

    const originX = 100;
    const originY = 400;
    const scale = 0.01; // Reduced scale for better visualization

    scaledPoints.forEach(p => {
      const x = originX + p.easting * scale;
      const y = originY - p.northing * scale;

      // Ensure points are within page bounds
      if (x > 50 && x < 550 && y > 50 && y < 750) {
        doc.circle(x, y, 3).fill("#000");
        doc.fontSize(8).fillColor("#000").text(p.name, x + 5, y - 2);
      }
    });

    doc.end();
  });
};

module.exports = { exportToTxt, exportToDxf , exportToPdf };

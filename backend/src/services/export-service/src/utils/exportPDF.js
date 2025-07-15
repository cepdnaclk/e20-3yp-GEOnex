const fs = require("fs");
const path = require("path");
const { transformToSLD99 } = require("./convertSLD99");

const PDFDocument = require("pdfkit");

const exportToPdf = (points, filename, project) => {
  return new Promise((resolve, reject) => {
    if (!points || points.length === 0) {
      reject(new Error("No points to export"));
      return;
    }

    // A3 Landscape: 1190 x 842 pts
    const doc = new PDFDocument({ 
      margin: 0, 
      size: 'A3',
      layout: 'landscape'
    });
    
    const filePath = path.join(__dirname, "../exports", filename);
    const exportDir = path.dirname(filePath);
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    writeStream.on('finish', () => resolve(filePath));
    writeStream.on('error', reject);

    // ==== PROFESSIONAL HEADER SECTION ====
    drawProfessionalHeader(doc, project);

    // ==== DATA TABLE SECTION ====
    drawDataTable(doc, points);

    // ==== MAIN MAP AND CERTIFICATION LAYOUT ====
    drawMainLayout(doc, points, project);

    if (points.length > 20) {
      doc.addPage({ margin: 0, size: 'A3', layout: 'landscape' });
      drawProfessionalHeader(doc, project, sideNumber = 2); 
      drawDataTable(doc, points.slice(20));
    }


    doc.end();
  });
};

function drawProfessionalHeader(doc, project, sideNumber = 1) {
  const headerHeight = 80;
  
  // Clean white background with subtle border
  doc.save();
  doc.rect(0, 0, 1190, headerHeight).fillColor('#FFFFFF').fill();
  doc.rect(0, 0, 1190, headerHeight).strokeColor('#333333').lineWidth(2).stroke();
  
  // Subtle grid pattern overlay (light gray)
  doc.strokeColor('#E8E8E8').lineWidth(0.3);
  for (let i = 0; i < 1190; i += 40) {
    doc.moveTo(i, 0).lineTo(i, headerHeight).stroke();
  }
  for (let i = 0; i < headerHeight; i += 20) {
    doc.moveTo(0, i).lineTo(1190, i).stroke();
  }
  
  // Company logo area (Black colored box named "GEOnex")
  doc.fillColor('#000000').rect(20, 20, 56, 56).fill();
  doc.fillColor('#FFFFFF').fontSize(11).font('Helvetica-Bold')
      .text("GEOnex", 20, 43, { width: 56, align: 'center' });
  doc.fillColor('#FFFFFF').fontSize(7).font('Helvetica');
  
  // Main title with professional styling
  doc.fontSize(28).font('Helvetica-Bold').fillColor('#2E5BBA')
     .text("GEOnex", 100, 20);
  doc.fontSize(24).fillColor('#1A1A1A')
     .text("SURVEY REPORT", 100, 45);
  
  // Professional Side Label
  const sideLabelX = 400;
  const sideLabelY = 35;

  // Side label text next to the star
  doc.fillColor('#333333').fontSize(16).font('Helvetica-Bold');
  doc.text(`S ${sideNumber}`, sideLabelX + 22, sideLabelY - 8, {
    width: 100,
    align: 'left'
  });
  
  // Technical specifications box
  doc.strokeColor('#2E5BBA').lineWidth(2);
  doc.rect(950, 15, 220, 50).fillColor('#F8F9FA').fill();
  doc.rect(950, 15, 220, 50).stroke();
  doc.fontSize(10).fillColor('#333333').font('Helvetica-Bold');
  doc.text(`PROJECT: ${project?.Name || "UNNAMED"}`, 960, 25);
  doc.text(`ZONE: ${project?.Zone || "UTM-44N"}`, 960, 35);
  doc.text(`GENERATED: ${new Date().toISOString().split('T')[0]}`, 960, 45);
  
  // Clean corner elements
  drawCleanCorner(doc, 1140, 16, '#2E5BBA');
  drawCleanCorner(doc, 1140, 54, '#2E5BBA');
  
  doc.restore();
}

// Clean corner brackets
function drawCleanCorner(doc, x, y, color) {
  doc.strokeColor(color).lineWidth(1.5);
  doc.moveTo(x, y).lineTo(x + 15, y).stroke();
  doc.moveTo(x, y).lineTo(x, y + 8).stroke();
  doc.moveTo(x + 15, y + 8).lineTo(x + 15, y).stroke();
  doc.moveTo(x + 8, y + 8).lineTo(x + 15, y + 8).stroke();
}

// Clean Data Table
// Clean Data Table with Split Layout
function drawDataTable(doc, points) {
  const tableY = 90;
  const tableHeight = 160;
  const rowHeight = 12;
  
  // Determine if we need to split the table
  const needsSplit = points.length > 12;
  const leftPoints = needsSplit ? points.slice(0, 10) : points;
  const rightPoints = needsSplit ? points.slice(10, 20) : []; 
  
  if (needsSplit) {
    // Draw two side-by-side tables
    drawTableSection(doc, leftPoints, 32, tableY, 545, tableHeight, rowHeight, "Slide 1");
    drawTableSection(doc, rightPoints, 612, tableY, 545, tableHeight, rowHeight, "Slide 2");
  } else {
    // Draw single full-width table
    drawTableSection(doc, leftPoints, 30, tableY, 1130, tableHeight, rowHeight, "");
  }
}

function drawTableSection(doc, points, startX, startY, tableWidth, tableHeight, rowHeight, sectionTitle) {
  // Table background
  doc.rect(startX, startY, tableWidth, tableHeight).fillColor('#FFFFFF').fill();
  doc.rect(startX, startY, tableWidth, tableHeight).strokeColor('#333333').lineWidth(1).stroke();
  
  // Section title if provided
  let headerY = startY;
  
  // Table header with professional styling
  doc.rect(startX, headerY, tableWidth, 20).fillColor('#E8E8E8').fill();
  doc.rect(startX, headerY, tableWidth, 20).strokeColor('#333333').lineWidth(1).stroke();
  doc.fontSize(10).font('Helvetica-Bold').fillColor('#1A1A1A');
  
  // Adjust column widths based on table width
  const isHalfWidth = tableWidth < 1000;
  const columns = [
    { title: "POINT ID", x: startX + 10, width: isHalfWidth ? 80 : 120 },
    { title: "LATITUDE", x: startX + (isHalfWidth ? 90 : 130), width: isHalfWidth ? 70 : 100 },
    { title: "LONGITUDE", x: startX + (isHalfWidth ? 160 : 230), width: isHalfWidth ? 70 : 100 },
    { title: "EASTING", x: startX + (isHalfWidth ? 230 : 330), width: isHalfWidth ? 70 : 100 },
    { title: "NORTHING", x: startX + (isHalfWidth ? 300 : 430), width: isHalfWidth ? 70 : 100 },
    { title: "SECTION", x: startX + (isHalfWidth ? 370 : 540), width: isHalfWidth ? 50 : 60 },
    { title: "TIMESTAMP", x: startX + (isHalfWidth ? 420 : 600), width: isHalfWidth ? 60 : 80 }
  ];
  
  columns.forEach(col => {
    doc.text(col.title, col.x, headerY + 7);
    doc.strokeColor('#CCCCCC').lineWidth(0.5);
    doc.moveTo(col.x + col.width, headerY).lineTo(col.x + col.width, headerY + 20).stroke();
  });
  
  // Table data with alternating row colors
  doc.font('Helvetica').fontSize(8);
  const maxRows = Math.min(points.length, 12); // Limit to 12 rows per section
  
  for (let idx = 0; idx < maxRows; idx++) {
    const point = points[idx];
    const rowY = headerY + 20 + (idx * rowHeight);
    
    // Alternating row background
    if (idx % 2 === 0) {
      doc.rect(startX, rowY, tableWidth, rowHeight).fillColor('#FFFFFF').fill();
    } else {
      doc.rect(startX, rowY, tableWidth, rowHeight).fillColor('#F8F9FA').fill();
    }
    
    // Row borders
    doc.strokeColor('#E8E8E8').lineWidth(0.3);
    doc.moveTo(startX, rowY).lineTo(startX + tableWidth, rowY).stroke();
    
    doc.fillColor('#333333');
    doc.text(point.Name || `PT${idx + 1}`, columns[0].x, rowY + 3);
    doc.text(parseFloat(point.Latitude).toFixed(6), columns[1].x, rowY + 3);
    doc.text(parseFloat(point.Longitude).toFixed(6), columns[2].x, rowY + 3);

    const sld99Coord = transformToSLD99(point.Latitude, point.Longitude);
    doc.text(sld99Coord.easting.toFixed(3), columns[3].x, rowY + 3);
    doc.text(sld99Coord.northing.toFixed(3), columns[4].x, rowY + 3);
    doc.text(point.Section || "Default", columns[5].x, rowY + 3);
    const timestamp = point.Timestamp
      ? new Date(point.Timestamp).toLocaleString()
      : "N/A";
    doc.text(timestamp, columns[6].x, rowY + 3);


  }
}

// Main Layout with Map and Certification
function drawMainLayout(doc, points, project) {
  const mapStartY = 270;
  const mapWidth = 750;
  const mapHeight = 520;
  const certificationX = 800;
  
  // Process points
  const processedPoints = points.map((p, idx) => ({
    ...p,
    name: p.Name || `PT${idx + 1}`,
    easting: (parseFloat(p.Longitude) - 80.0) * 100000,
    northing: (parseFloat(p.Latitude) - 7.0) * 100000,
    lat: parseFloat(p.Latitude),
    lon: parseFloat(p.Longitude),
    section: p.Section || "A"
  }));
  
  // Draw clean map
  drawCleanMap(doc, processedPoints, 30, mapStartY, mapWidth, mapHeight);
  
  // Draw certification panel
  drawCertificationPanel(doc, certificationX, mapStartY, 360, mapHeight, project);
  
  // Draw clean footer
  drawCleanFooter(doc);
}

// Clean Map with Print-Friendly Graphics
function drawCleanMap(doc, points, x, y, width, height) {
  // Calculate bounds
  const eastings = points.map(p => p.easting);
  const northings = points.map(p => p.northing);
  const minE = Math.min(...eastings), maxE = Math.max(...eastings);
  const minN = Math.min(...northings), maxN = Math.max(...northings);
  
  const scaleX = (maxE - minE) > 0 ? width / (maxE - minE) : 1;
  const scaleY = (maxN - minN) > 0 ? height / (maxN - minN) : 1;
  const scale = Math.min(scaleX, scaleY) * 0.8;
  
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  
  // Map frame with clean styling
  doc.save();
  doc.rect(x, y, width, height).fillColor('#FFFFFF').fill();
  doc.rect(x, y, width, height).strokeColor('#333333').lineWidth(2).stroke();
  
  // Light grid overlay
  doc.strokeColor('#E8E8E8').lineWidth(0.3);
  for (let i = 0; i <= 20; i++) {
    const gridX = x + (width / 20) * i;
    const gridY = y + (height / 20) * i;
    doc.moveTo(gridX, y).lineTo(gridX, y + height).stroke();
    doc.moveTo(x, gridY).lineTo(x + width, gridY).stroke();
  }
  
  // Coordinate conversion helper
  const toMapCoords = (easting, northing) => ({
    x: centerX + (easting - (minE + maxE) / 2) * scale,
    y: centerY - (northing - (minN + maxN) / 2) * scale
  });
  
  // Group by section
  const sections = {};
  points.forEach(p => {
    if (!sections[p.section]) sections[p.section] = [];
    sections[p.section].push(p);
  });
  
  // Print-friendly color palette (darker colors for better contrast)
  const colors = ['#2E5BBA', '#C8102E', '#1B5E20', '#F57C00', '#6A1B9A', '#B71C1C', '#0D47A1'];
  
  let colorIndex = 0;
  Object.entries(sections).forEach(([section, sectionPoints]) => {
    const color = colors[colorIndex % colors.length];
    const sortedPoints = sortPointsForPolygon(sectionPoints);
    
    if (sortedPoints.length >= 3) {
      const mapPoints = sortedPoints.map(p => toMapCoords(p.easting, p.northing));
      
      // Draw filled polygon with subtle fill
      doc.save();
      doc.fillColor(color).fillOpacity(0.15);
      doc.moveTo(mapPoints[0].x, mapPoints[0].y);
      mapPoints.slice(1).forEach(pt => doc.lineTo(pt.x, pt.y));
      doc.closePath().fill();
      
      // Solid border
      doc.strokeColor(color).lineWidth(2).strokeOpacity(1);
      doc.moveTo(mapPoints[0].x, mapPoints[0].y);
      mapPoints.slice(1).forEach(pt => doc.lineTo(pt.x, pt.y));
      doc.closePath().stroke();
      doc.restore();
    }
    
    // Draw points with clean styling
    sectionPoints.forEach(p => {
      const { x: px, y: py } = toMapCoords(p.easting, p.northing);
      
      // Point with clean design
      doc.circle(px, py, 8).fillColor('#FFFFFF').fill();
      doc.circle(px, py, 8).strokeColor(color).lineWidth(2).stroke();
      doc.circle(px, py, 5).fillColor(color).fill();
      doc.circle(px, py, 2).fillColor('#FFFFFF').fill();
      
      // Point label with clean background
      const labelWidth = p.name.length * 6 + 4;
      doc.rect(px + 10, py - 8, labelWidth, 14).fillColor('#FFFFFF').fillOpacity(0.9).fill();
      doc.rect(px + 10, py - 8, labelWidth, 14).strokeColor('#CCCCCC').lineWidth(0.5).stroke();
      doc.fontSize(8).font('Helvetica-Bold').fillColor('#1A1A1A').fillOpacity(1)
         .text(p.name, px + 12, py - 4);
    });
    
    colorIndex++;
  });
  
  // Compass with clean design
  drawCleanCompass(doc, x + width - 80, y + 40);
  
  // Scale bar
  drawScaleBar(doc, x + 30, y + height - 40, scale);
  
  // Technical information overlay
  doc.fontSize(10).fillColor('#2E5BBA').font('Helvetica-Bold');
  doc.text(`SCALE: 1:${Math.round(1/scale)}`, x + 30, y + 20);
  doc.text(`DATUM: WGS84`, x + 30, y + 35);
  doc.text(`PROJECTION: UTM`, x + 30, y + 50);
  
  doc.restore();
}

// Clean Compass
function drawCleanCompass(doc, x, y) {
  doc.save();
  doc.circle(x, y, 15).fillColor('#FFFFFF').fill();
  doc.circle(x, y, 15).strokeColor('#333333').lineWidth(1.5).stroke();
  
  // North arrow
  doc.moveTo(x, y).lineTo(x, y - 20).strokeColor('#C8102E').lineWidth(2).stroke();
  doc.moveTo(x, y - 20).lineTo(x - 4, y - 15).lineTo(x + 4, y - 15).closePath()
     .fillColor('#C8102E').fill();
  
  // Cardinal directions
  doc.fontSize(10).font('Helvetica-Bold').fillColor('#1A1A1A');
  doc.text('N', x - 3, y - 35);
  doc.text('S', x - 3, y + 20);
  doc.text('E', x + 20, y - 3);
  doc.text('W', x - 30, y - 3);
  
  doc.restore();
}

// Scale Bar
function drawScaleBar(doc, x, y, scale) {
  const barLength = 100;
  const realDistance = barLength / scale;
  
  doc.rect(x, y, barLength, 8).fillColor('#FFFFFF').fill();
  doc.rect(x, y, barLength, 8).strokeColor('#333333').lineWidth(1).stroke();
  
  // Scale divisions
  for (let i = 0; i <= 4; i++) {
    const divX = x + (barLength / 4) * i;
    doc.moveTo(divX, y).lineTo(divX, y + 8).strokeColor('#333333').stroke();
    
    // Alternating black and white segments for better visibility
    if (i < 4) {
      const segmentColor = i % 2 === 0 ? '#1A1A1A' : '#FFFFFF';
      doc.rect(divX, y, barLength / 4, 8).fillColor(segmentColor).fill();
    }
  }
  
  doc.fontSize(8).fillColor('#1A1A1A').font('Helvetica-Bold');
  doc.text(`${Math.round(realDistance)}m`, x + barLength + 10, y + 2);
}

// Clean Certification Panel
function drawCertificationPanel(doc, x, y, width, height, project) {
  // Panel background with clean styling
  doc.rect(x, y, width, height).fillColor('#FFFFFF').fill();
  doc.rect(x, y, width, height).strokeColor('#333333').lineWidth(2).stroke();
  
  // Clean corner brackets
  drawCleanCorner(doc, x + 10, y + 10, '#2E5BBA');
  drawCleanCorner(doc, x + width - 25, y + 10, '#2E5BBA');
  drawCleanCorner(doc, x + 10, y + height - 18, '#2E5BBA');
  drawCleanCorner(doc, x + width - 25, y + height - 18, '#2E5BBA');
  
  // Title
  doc.fontSize(16).font('Helvetica-Bold').fillColor('#2E5BBA');
  doc.text('SURVEY CERTIFICATION', x + 20, y + 30);
  
  // Certification content
  doc.fontSize(12).fillColor('#1A1A1A').font('Helvetica-Bold');
  doc.text('PROJECT SPECIFICATIONS', x + 20, y + 70);
  
  doc.fontSize(10).fillColor('#333333').font('Helvetica');
  doc.text(`Project Name: ${project?.Name || 'UNNAMED PROJECT'}`, x + 20, y + 95);
  doc.text(`Survey Date: ${new Date().toLocaleDateString()}`, x + 20, y + 110);
  doc.text(`Total Points: ${project?.Total_Points || 'N/A'}`, x + 20, y + 125);
  doc.text(`Coordinate System: ${project?.Zone || 'UTM Zone 44N'}`, x + 20, y + 140);
  doc.text(`Datum: WGS84`, x + 20, y + 155);
  doc.text(`Survey Method: DGPS`, x + 20, y + 170);
  doc.text(`Accuracy: ±1.5m`, x + 20, y + 185);
  
  // Certification fields
  doc.fontSize(12).fillColor('#1A1A1A').font('Helvetica-Bold');
  doc.text('CERTIFICATION', x + 20, y + 220);
  
  doc.fontSize(10).fillColor('#333333').font('Helvetica');
  doc.text('Survey Conducted By:', x + 20, y + 250);
  doc.rect(x + 20, y + 270, 300, 20).fillColor('#F8F9FA').fill();
  doc.rect(x + 20, y + 270, 300, 20).strokeColor('#333333').lineWidth(1).stroke();
  
  doc.fontSize(10).fillColor('#333333').font('Helvetica');
  doc.text('Licensed Surveyor:', x + 20, y + 310);
  doc.rect(x + 20, y + 330, 300, 20).fillColor('#F8F9FA').fill();
  doc.rect(x + 20, y + 330, 300, 20).strokeColor('#333333').lineWidth(1).stroke();
  
  doc.fontSize(10).fillColor('#333333').font('Helvetica');
  doc.text('Verification Date:', x + 20, y + 370);
  doc.rect(x + 20, y + 390, 150, 20).fillColor('#F8F9FA').fill();
  doc.rect(x + 20, y + 390, 150, 20).strokeColor('#333333').lineWidth(1).stroke();
  
  doc.fontSize(10).fillColor('#333333').font('Helvetica');
  doc.text('Digital Signature:', x + 20, y + 430);
  doc.rect(x + 20, y + 450, 300, 40).fillColor('#F8F9FA').fill();
  doc.rect(x + 20, y + 450, 300, 40).strokeColor('#333333').lineWidth(1).stroke();
  
  // QR Code placeholder
  doc.rect(x + 250, y + 250, 80, 80).fillColor('#F8F9FA').fill();
  doc.rect(x + 250, y + 250, 80, 80).strokeColor('#333333').lineWidth(1).stroke();
  doc.fontSize(8).fillColor('#333333').font('Helvetica-Bold').text('QR CODE', x + 275, y + 285);
  doc.text('VERIFICATION', x + 265, y + 295);
}

// Clean Footer
function drawCleanFooter(doc) {
  const footerY = 800;
  
  doc.rect(0, footerY, 1190, 42).fillColor('#F8F9FA').fill();
  doc.rect(0, footerY, 1190, 42).strokeColor('#333333').lineWidth(1).stroke();
  
  doc.fontSize(8).fillColor('#333333').font('Helvetica');
  doc.text('© 2025 GEOnex Survey Platform | Professional Survey Solutions | geonex.site', 30, footerY + 10);
  doc.text(`Document ID: ${generateDocumentId()}`, 30, footerY + 25);
  
  doc.text('CONFIDENTIAL - AUTHORIZED PERSONNEL ONLY', 850, footerY + 10);
  doc.text(`Generated: ${new Date().toISOString()}`, 850, footerY + 25);
}

// Helper Functions
function sortPointsForPolygon(points) {
  if (points.length < 3) return points;
  
  const centerX = points.reduce((sum, p) => sum + p.easting, 0) / points.length;
  const centerY = points.reduce((sum, p) => sum + p.northing, 0) / points.length;
  
  return points.sort((a, b) => {
    const angleA = Math.atan2(a.northing - centerY, a.easting - centerX);
    const angleB = Math.atan2(b.northing - centerY, b.easting - centerX);
    return angleA - angleB;
  });
}

function generateDocumentId() {
  return 'GEO-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
}


module.exports = {
    exportToPdf
    };
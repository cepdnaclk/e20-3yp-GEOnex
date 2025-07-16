// Correct SLD99 (Sri Lanka Grid 1999) parameters - EPSG:5235
const SLD99_PARAMS = {
  // Ellipsoid parameters (Everest 1830 - 1937 Adjustment)
  a: 6377276.345,        // Semi-major axis (meters)
  invf: 300.8017,        // Inverse flattening
  
  // Projection parameters for SLD99
  lat0: 7.000471527777778,    // Latitude of natural origin (7°00'01.697" N)
  lon0: 80.77171308333333,    // Longitude of natural origin (80°46'18.167" E)
  k0: 0.9999238418,           // Scale factor at natural origin
  falseEasting: 200000,       // False easting (meters) - NOT 500000
  falseNorthing: 200000       // False northing (meters) - NOT 500000
};

// 7-parameter Helmert transformation parameters (WGS84 to SLD99)
const HELMERT_PARAMS = {
  dx: 0.2933,           // Translation X (meters)
  dy: -766.9499,        // Translation Y (meters)
  dz: -87.7131,         // Translation Z (meters)
  rx: 0.1957040,        // Rotation X (arc seconds)
  ry: 1.6950,           // Rotation Y (arc seconds)
  rz: 0.4434,           // Rotation Z (arc seconds)
  ds: -0.9003           // Scale change (ppm)
};

// Helper functions
const degToRad = (deg) => deg * (Math.PI / 180);
const radToDeg = (rad) => rad * (180 / Math.PI);
const arcsecToRad = (arcsec) => arcsec * (Math.PI / 180) / 3600;

// Convert WGS84 geographic coordinates to Cartesian (ECEF)
const geographicToCartesian = (lat, lon, height = 0) => {
  const WGS84_A = 6378137.0;
  const WGS84_E2 = 0.00669437999014;
  
  const latRad = degToRad(lat);
  const lonRad = degToRad(lon);
  
  const N = WGS84_A / Math.sqrt(1 - WGS84_E2 * Math.sin(latRad) * Math.sin(latRad));
  
  const x = (N + height) * Math.cos(latRad) * Math.cos(lonRad);
  const y = (N + height) * Math.cos(latRad) * Math.sin(lonRad);
  const z = (N * (1 - WGS84_E2) + height) * Math.sin(latRad);
  
  return { x, y, z };
};

// Convert Cartesian coordinates back to geographic
const cartesianToGeographic = (x, y, z) => {
  const a = SLD99_PARAMS.a;
  const e2 = 2 / SLD99_PARAMS.invf - 1 / (SLD99_PARAMS.invf * SLD99_PARAMS.invf);
  
  const p = Math.sqrt(x * x + y * y);
  const theta = Math.atan2(z * a, p * (1 - e2));
  
  const lat = Math.atan2(z + e2 * a * Math.sin(theta) * Math.sin(theta) * Math.sin(theta),
                        p - e2 * a * Math.cos(theta) * Math.cos(theta) * Math.cos(theta));
  const lon = Math.atan2(y, x);
  
  return { lat: radToDeg(lat), lon: radToDeg(lon) };
};

// Apply 7-parameter Helmert transformation (WGS84 to SLD99)
const applyHelmertTransformation = (x, y, z) => {
  const dx = HELMERT_PARAMS.dx;
  const dy = HELMERT_PARAMS.dy;
  const dz = HELMERT_PARAMS.dz;
  const rx = arcsecToRad(HELMERT_PARAMS.rx);
  const ry = arcsecToRad(HELMERT_PARAMS.ry);
  const rz = arcsecToRad(HELMERT_PARAMS.rz);
  const ds = HELMERT_PARAMS.ds * 1e-6; // ppm to ratio
  
  const scale = 1 + ds;
  
  // Apply transformation
  const xTransformed = dx + scale * (x - rz * y + ry * z);
  const yTransformed = dy + scale * (rz * x + y - rx * z);
  const zTransformed = dz + scale * (-ry * x + rx * y + z);
  
  return { x: xTransformed, y: yTransformed, z: zTransformed };
};

// Transverse Mercator projection (SLD99 datum coordinates to grid)
const transverseMercatorProjection = (latitude, longitude) => {
  const lat = degToRad(latitude);
  const lon = degToRad(longitude);
  const lat0 = degToRad(SLD99_PARAMS.lat0);
  const lon0 = degToRad(SLD99_PARAMS.lon0);
  
  const a = SLD99_PARAMS.a;
  const f = 1 / SLD99_PARAMS.invf;
  const e2 = 2 * f - f * f;
  const e = Math.sqrt(e2);
  const k0 = SLD99_PARAMS.k0;
  
  const dlon = lon - lon0;
  const nu = a / Math.sqrt(1 - e2 * Math.sin(lat) * Math.sin(lat));
  const rho = a * (1 - e2) / Math.pow(1 - e2 * Math.sin(lat) * Math.sin(lat), 1.5);
  const eta2 = nu / rho - 1;
  
  const T = Math.tan(lat) * Math.tan(lat);
  const C = e2 * Math.cos(lat) * Math.cos(lat) / (1 - e2);
  const A = Math.cos(lat) * dlon;
  
  // Calculate meridional arc length
  const M = a * ((1 - e2/4 - 3*e2*e2/64 - 5*e2*e2*e2/256) * lat -
                 (3*e2/8 + 3*e2*e2/32 + 45*e2*e2*e2/1024) * Math.sin(2*lat) +
                 (15*e2*e2/256 + 45*e2*e2*e2/1024) * Math.sin(4*lat) -
                 (35*e2*e2*e2/3072) * Math.sin(6*lat));
  
  const M0 = a * ((1 - e2/4 - 3*e2*e2/64 - 5*e2*e2*e2/256) * lat0 -
                  (3*e2/8 + 3*e2*e2/32 + 45*e2*e2*e2/1024) * Math.sin(2*lat0) +
                  (15*e2*e2/256 + 45*e2*e2*e2/1024) * Math.sin(4*lat0) -
                  (35*e2*e2*e2/3072) * Math.sin(6*lat0));
  
  // Calculate easting and northing
  const x = k0 * nu * (A + (1-T+C) * A*A*A/6 + (5-18*T+T*T+72*C-58*eta2) * A*A*A*A*A/120);
  const y = k0 * (M - M0 + nu * Math.tan(lat) * (A*A/2 + (5-T+9*C+4*C*C) * A*A*A*A/24 + 
                  (61-58*T+T*T+600*C-330*eta2) * A*A*A*A*A*A/720));
  
  const easting = x + SLD99_PARAMS.falseEasting;
  const northing = y + SLD99_PARAMS.falseNorthing;
  
  return { easting, northing };
};

// Main transformation function: WGS84 lat/lon to SLD99 grid coordinates
const transformToSLD99 = (latitude, longitude, height = 0) => {
  try {
    // Step 1: Convert WGS84 geographic to Cartesian
    const cartesian = geographicToCartesian(latitude, longitude, height);
    
    // Step 2: Apply Helmert transformation to convert to SLD99 datum
    const transformed = applyHelmertTransformation(cartesian.x, cartesian.y, cartesian.z);
    
    // Step 3: Convert back to geographic coordinates in SLD99 datum
    const sld99Geographic = cartesianToGeographic(transformed.x, transformed.y, transformed.z);
    
    // Step 4: Apply Transverse Mercator projection
    const projected = transverseMercatorProjection(sld99Geographic.lat, sld99Geographic.lon);
    
    return {
      easting: Math.round(projected.easting * 1000) / 1000,  // Round to mm precision
      northing: Math.round(projected.northing * 1000) / 1000
    };
  } catch (error) {
    throw new Error(`SLD99 transformation failed: ${error.message}`);
  }
};

// Example usage and testing
const testCoordinates = [
  { lat: 6.9271, lon: 79.8612, name: "Colombo" },
  { lat: 7.2906, lon: 80.6337, name: "Kandy" },
  { lat: 8.3114, lon: 80.4037, name: "Anuradhapura" }
];

const testTransformation = () => {
  console.log("Testing SLD99 transformation:");
  console.log("================================");
  
  testCoordinates.forEach(coord => {
    const result = transformToSLD99(coord.lat, coord.lon);
    console.log(`${coord.name}:`);
    console.log(`  WGS84: ${coord.lat}°N, ${coord.lon}°E`);
    console.log(`  SLD99: ${result.easting}E, ${result.northing}N`);
    console.log("");
  });
};

module.exports = {
  transformToSLD99,
  testTransformation,
  SLD99_PARAMS,
  HELMERT_PARAMS
};
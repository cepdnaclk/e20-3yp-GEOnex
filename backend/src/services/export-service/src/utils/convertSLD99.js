const SLD99_PARAMS = {
  // Ellipsoid parameters (Everest 1830 - 1937 Adjustment)
  a: 6377276.345,  // Semi-major axis
  invf: 300.8017,  // Inverse flattening
  
  // Projection parameters
  lat0: 7.00047152777778,    // Latitude of natural origin (degrees)
  lon0: 80.7717130833333,    // Longitude of natural origin (degrees)
  k0: 0.9999238418,          // Scale factor at natural origin
  falseEasting: 500000,      // False easting (meters)
  falseNorthing: 500000      // False northing (meters)
};

// Helper functions for coordinate transformation
const degToRad = (deg) => deg * (Math.PI / 180);
const radToDeg = (rad) => rad * (180 / Math.PI);

// Transform from geographic (lat/lon) to SLD99 projected coordinates
const transformToSLD99 = (latitude, longitude) => {
  const lat = degToRad(latitude);
  const lon = degToRad(longitude);
  const lat0 = degToRad(SLD99_PARAMS.lat0);
  const lon0 = degToRad(SLD99_PARAMS.lon0);
  
  const a = SLD99_PARAMS.a;
  const f = 1 / SLD99_PARAMS.invf;
  const e2 = 2 * f - f * f;
  const e = Math.sqrt(e2);
  
  const k0 = SLD99_PARAMS.k0;
  
  // Transverse Mercator projection calculations
  const dlon = lon - lon0;
  const nu = a / Math.sqrt(1 - e2 * Math.sin(lat) * Math.sin(lat));
  const rho = a * (1 - e2) / Math.pow(1 - e2 * Math.sin(lat) * Math.sin(lat), 1.5);
  const eta2 = nu / rho - 1;
  
  const T = Math.tan(lat) * Math.tan(lat);
  const C = e2 * Math.cos(lat) * Math.cos(lat) / (1 - e2);
  const A = Math.cos(lat) * dlon;
  
  const M = a * ((1 - e2/4 - 3*e2*e2/64 - 5*e2*e2*e2/256) * lat -
                 (3*e2/8 + 3*e2*e2/32 + 45*e2*e2*e2/1024) * Math.sin(2*lat) +
                 (15*e2*e2/256 + 45*e2*e2*e2/1024) * Math.sin(4*lat) -
                 (35*e2*e2*e2/3072) * Math.sin(6*lat));
  
  const M0 = a * ((1 - e2/4 - 3*e2*e2/64 - 5*e2*e2*e2/256) * lat0 -
                  (3*e2/8 + 3*e2*e2/32 + 45*e2*e2*e2/1024) * Math.sin(2*lat0) +
                  (15*e2*e2/256 + 45*e2*e2*e2/1024) * Math.sin(4*lat0) -
                  (35*e2*e2*e2/3072) * Math.sin(6*lat0));
  
  const x = k0 * nu * (A + (1-T+C) * A*A*A/6 + (5-18*T+T*T+72*C-58*eta2) * A*A*A*A*A/120);
  const y = k0 * (M - M0 + nu * Math.tan(lat) * (A*A/2 + (5-T+9*C+4*C*C) * A*A*A*A/24 + 
                  (61-58*T+T*T+600*C-330*eta2) * A*A*A*A*A*A/720));
  
  const easting = x + SLD99_PARAMS.falseEasting;
  const northing = y + SLD99_PARAMS.falseNorthing;
  
  return { easting, northing };
};


module.exports = {
    transformToSLD99
};